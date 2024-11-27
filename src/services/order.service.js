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
const Table_FoodMenu = require("../models/table_foodMenu");

class OrderService {
  static createOrder = async ({ listTables }) => {
    let listIdTable;
    try {
      listIdTable = await TableService.validateListTable(listTables);
    } catch (error) {
      throw error;
    }

    const listTable = await Table.findAll({
      where: {
        id: {
          [Op.in]: listIdTable,
        },
      },
      include: [
        {
          model: FoodMenu,
          through: {
            model: Table_FoodMenu,
            attributes: ["id", "quantity"],
          },
          attributes: ["id", "price"],
        },
      ],
      attributes: ["id", "customer_id"],
      raw: true,
      nest: true,
    });
    const listIdTableFoodMenu = listTable.map(
      (item) => item.FoodMenus?.Table_FoodMenu?.id
    );

    // tao hoa don theo tung ban
    let listOrder = [];
    for (let table of listTables) {
      const newOrder = await Order.create({
        table_id: table.id,
        discount_id: null,
        total_price: 0,
      });
      listOrder.push(newOrder);
    }

    let listOrderItem = [];
    for (let table of listTable) {
      listOrderItem.push({
        order_id: listOrder.find((order) => order.table_id === table.id)?.id,
        food_menu_id: table.FoodMenus.id,
        quantity: table.FoodMenus.Table_FoodMenu.quantity,
      });
    }

    await OrderItem.bulkCreate(listOrderItem);
    await Table.update(
      {
        status: "available",
      },
      {
        where: {
          id: { [Op.in]: listIdTable },
        },
      }
    );
    await this.calcTotalPrice(listOrder);
    const data = this.getOrder(listIdTable);
    TableService.deleteTableFoodMenuById(listIdTableFoodMenu);
    return data;
  };

  static getOrder = async (listIdTable) => {
    const ordersWithDetails = await Order.findAll({
      where: {
        table_id: { [Op.in]: listIdTable },
      },
      include: [
        {
          model: FoodMenu,
          include: [
            {
              model: FoodCategory,
            },
            {
              model: Unit,
            },
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    const listOrder = ordersWithDetails.map((order) => {
      return {
        orderId: order.id,
        listFoods: [
          {
            id: order.FoodMenus.id,
            name: order.FoodMenus.name,
            image_url: order.FoodMenus.image_url,
            price: order.FoodMenus.price,
            category: order.FoodMenus?.FoodCategory?.name,
            unit: order.FoodMenus?.Unit?.name,
            quantity: order.FoodMenus?.OrderItem?.quantity,
          },
        ],
        total_price: order.total_price,
      };
    });

    const data = listOrder?.reduce((acc, cur) => {
      const orderExists = acc?.find((item) => item.orderId === cur.orderId);
      if (orderExists) {
        orderExists.listFoods?.push(...cur.listFoods);
      } else {
        acc?.push(cur);
      }
      return acc;
    }, []);

    return data;
  };

  static calcTotalPrice = async (listOrder) => {
    for (let order of listOrder) {
      const orderItems = await OrderItem.findAll({
        where: {
          order_id: order.id,
        },
        include: [
          {
            model: FoodMenu,
            attributes: ["price"],
          },
        ],
      });
      const total_price = orderItems.reduce((total, item) => {
        return total + item.quantity * item.FoodMenu.price;
      }, 0);

      await Order.update(
        {
          total_price,
        },
        {
          where: {
            id: order.id,
          },
        }
      );
    }
  };
}

module.exports = OrderService;
