"use strict";

const { HTTP_STATUS_CODE, MESSAGES } = require("../core/constant.response");
const { MissingInputError } = require("../core/error.response");

const Table = require("../models/table");
const FoodMenu = require("../models/food_menu");
const FoodCategory = require("../models/food_category");
const Unit = require("../models/unit");
const OrderItem = require("../models/order_item");
const Order = require("../models/order");

const { Op } = require("sequelize");
const TableService = require("../services/table.service");
const DiscountService = require("../services/discount.service");

const Table_FoodMenu = require("../models/table_foodMenu");
const Customer = require("../models/customer");
const TableCustomer = require("../models/table_customer");
const CustomerDiscount = require("../models/customer_discount");
const OrderDiscount = require("../models/order_discount");

class OrderService {
  static createOrder = async ({ listTables }) => {
    let listIdTable;
    try {
      listIdTable = await TableService.validateListTable(
        listTables,
        TableService.TABLE_STATUS.OCCUPIED
      );
    } catch (error) {
      throw error;
    }

    const listTable = await TableService.getListFoodByTable({ listTables });
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

    // update status table
    await TableService.updateStatusTable(
      TableService.TABLE_STATUS.AVAILABLE,
      listIdTable
    );

    await TableCustomer.destroy({
      where: {
        table_id: {
          [Op.in]: listIdTable,
        },
        customer_id: customer.id,
      },
    });
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
}

module.exports = OrderService;
