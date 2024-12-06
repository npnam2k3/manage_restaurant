"use strict";

const { HTTP_STATUS_CODE, MESSAGES } = require("../core/constant.response");
const { MissingInputError, NotFoundError } = require("../core/error.response");

const OrderItem = require("../models/order_item");
const Customer = require("../models/customer");
const Order = require("../models/order");
const FoodMenu = require("../models/food_menu");
const FoodCategory = require("../models/food_category");
const Unit = require("../models/unit");

const TableService = require("../services/table.service");
const DiscountService = require("../services/discount.service");
const OrderDiscount = require("../models/order_discount");
const { Op, where, fn, col } = require("sequelize");

const { getInfoData } = require("../utils/index");
const { formatDate, convertToDate } = require("../utils/formatDate");
const Discount = require("../models/discount");

class OrderService {
  static createOrder = async ({ listTables }) => {
    const listIdTable = listTables.map((item) => item.id);

    const listTable = await TableService.getListFoodByTableForPayment({
      listTables,
    });
    // console.log("check list table::", listTable);

    const customer = {
      id: listTable[0].customer_id,
      customer_name: listTable[0].customer_name,
      phone_number: listTable[0].phone_number,
    };

    // tao hoa don
    const newOrder = await Order.create({
      total_price: 0,
      customer_id: customer.id,
    });

    // them order item vao bang OrderItem
    await this.saveOrderItem(listTable, newOrder);

    const totalOrder = this.calcTotalPrice(listTable);

    const { listDiscountForLoyaltyCus, listDiscountNormal } =
      await DiscountService.classifyDiscount();

    const listDiscountUsed = [];
    // co discount danh cho khtt
    let totalSale = 0;
    if (listDiscountForLoyaltyCus.length > 0) {
      const listDiscount = await DiscountService.findDiscountOfLoyaltyCustomer(
        customer.id
      );
      const maxItem = DiscountService.findMaxValueDiscountForLoyalCus(
        listDiscount,
        totalOrder
      );

      if (maxItem) {
        totalSale += maxItem.saleAmount;
        this.saveOrderDiscount(newOrder.id, maxItem.discountId);
        // cap nhat lai trang thai discount danh cho customer nay la da su dung
        await DiscountService.updateStatusDiscountForLoyalCus(
          customer.id,
          maxItem.discountId
        );
        listDiscountUsed.push(maxItem);
      }
    }

    if (listDiscountNormal.length > 0) {
      const listDiscount = listDiscountNormal.filter(
        (item) => item.min_order_value <= totalOrder
      );
      const maxItem = DiscountService.findMaxValueDiscountNormal(
        listDiscount,
        totalOrder
      );
      if (maxItem) {
        totalSale += maxItem.saleAmount;
        this.saveOrderDiscount(newOrder.id, maxItem.discountId);
        listDiscountUsed.push(maxItem);
      }
    }

    const totalAfterUseDiscount =
      totalSale > 0 ? totalOrder - totalSale : totalOrder;

    // cap nhat tong hoa don
    await this.saveTotalPriceOrder(totalAfterUseDiscount, newOrder.id);

    // delete table in table_customer
    await TableService.deleteTableCustomer(listIdTable, customer.id);

    TableService.deleteTableFoodMenuById(listIdTable);
    const listTableResponse = listTable.map((table) => {
      return {
        tableId: table.tableId,
        number: table.number,
        seat_number: table.seat_number,
        listFoods: table.listFoods,
      };
    });
    const data = {
      totalOrder,
      totalSale,
      totalAfterUseDiscount,
      customer,
      listDiscountUsed,
      listTableResponse,
    };
    return data;
  };

  static calcTotalPrice = (listTable) => {
    let totalOrder = 0;
    for (let table of listTable) {
      totalOrder += table.listFoods.reduce((total, curr) => {
        return total + curr.quantity * curr.price;
      }, 0);
    }
    return totalOrder;
  };

  static saveOrderDiscount = async (orderId, discountId) => {
    await OrderDiscount.create({
      order_id: orderId,
      discount_id: discountId,
    });
  };

  static saveOrderItem = async (listTable, newOrder) => {
    let listOrderItem = [];
    for (let table of listTable) {
      for (let food of table.listFoods) {
        listOrderItem.push({
          order_id: newOrder.id,
          food_menu_id: food.id,
          quantity: food.quantity,
        });
      }
    }

    for (let orderItem of listOrderItem) {
      const [record, created] = await OrderItem.findOrCreate({
        where: {
          order_id: newOrder.id,
          food_menu_id: orderItem.food_menu_id,
        },
        defaults: {
          quantity: orderItem.quantity,
        },
      });
      if (!created) {
        await record.update({
          quantity: record.quantity + orderItem.quantity,
        });
      }
    }
  };

  static saveTotalPriceOrder = async (total, orderId) => {
    await Order.update(
      {
        total_price: total,
      },
      {
        where: {
          id: orderId,
        },
      }
    );
  };

  static getAllOrder = async ({
    page,
    limit,
    sortBy,
    orderBy,
    customerName,
    dateFind,
  }) => {
    const queries = {
      offset: (page - 1) * limit,
      limit,
    };
    if (sortBy) {
      queries.order = [[sortBy, orderBy]];
    }
    if (dateFind) {
      const dateFormat = convertToDate(dateFind);
      queries.where = {
        [Op.and]: [
          where(fn("DATE", col("Order.createdAt")), {
            [Op.eq]: fn("DATE", dateFormat),
          }),
        ],
      };
    }
    let subQueries = {};
    if (customerName) {
      subQueries.where = {
        full_name: {
          [Op.substring]: customerName,
        },
      };
    }
    const { count, rows } = await Order.findAndCountAll({
      ...queries,
      include: [
        {
          model: Customer,
          where: {
            ...subQueries.where,
          },
        },
      ],
      raw: true,
      nest: true,
    });
    let listOrders;
    if (count > 0) {
      listOrders = rows.map((order) => {
        const data = getInfoData({
          fields: ["id", "total_price"],
          object: order,
        });
        data.createdAt = formatDate(order.createdAt);
        data.customer = {
          full_name: order.Customer.full_name,
          phone_number: order.Customer.phone_number,
        };
        return data;
      });
      return {
        total: listOrders.length,
        page,
        limit,
        sortBy,
        orderBy,
        totalPage: Math.ceil(count / limit),
        listOrders,
      };
    }

    return {
      total: 0,
      page,
      limit,
      sortBy,
      orderBy,
      totalPage: 0,
      listOrders: [],
    };
  };

  static getById = async (orderId) => {
    if (!orderId)
      throw new MissingInputError(
        MESSAGES.ERROR.INVALID_INPUT,
        HTTP_STATUS_CODE.BAD_REQUEST,
        {
          orderId: MESSAGES.ORDER.MISSING_ID,
        }
      );
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: Customer,
        },
        {
          model: FoodMenu,
          through: {
            attributes: ["quantity"],
          },
          include: [
            {
              model: FoodCategory,
            },
            {
              model: Unit,
            },
          ],
        },
        {
          model: Discount,
          through: {
            attributes: [],
          },
        },
      ],
      raw: false,
      nest: true,
    });

    let response = {};
    if (!order) {
      throw new NotFoundError(
        MESSAGES.ERROR.NOT_FOUND,
        HTTP_STATUS_CODE.NOT_FOUND,
        {
          order: MESSAGES.ORDER.NOT_FOUND,
        }
      );
    }
    const listFoods = order.FoodMenus.map((item) => {
      const food = item.toJSON();
      return {
        id: food.id,
        name: food.name,
        image_url: food.image_url,
        description: food.description,
        category: food.FoodCategory.name,
        unit: {
          name: food.Unit.name,
          description: food.Unit.description || null,
        },
        price: food.price,
        quantity: food.OrderItem.quantity,
        subTotal: food.price * food.OrderItem.quantity,
      };
    });
    let listDiscounts;
    if (order.Discounts.length > 0) {
      listDiscounts = order.Discounts.map((discount) => {
        const discountObj = discount.toJSON();
        return {
          code: discountObj.code,
          description: discountObj.description,
          discount_amount: discountObj.discount_amount,
          discount_type: discountObj.discount_type,
        };
      });
    }
    const customerObj = order.Customer.toJSON();
    response = {
      id: order.id,
      total_price: order.total_price,
      createdAt: formatDate(order.createdAt),
      customer: {
        full_name: customerObj.full_name,
        phone_number: customerObj.phone_number,
      },
      listFoods,
      listDiscounts,
    };
    return response;
  };
}

module.exports = OrderService;
