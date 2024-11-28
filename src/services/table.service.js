"use strict";
const Table = require("../models/table");
const Customer = require("../models/customer");
const FoodMenu = require("../models/food_menu");
const FoodCategory = require("../models/food_category");
const Table_FoodMenu = require("../models/table_foodMenu");
const Unit = require("../models/unit");
const TableCustomer = require("../models/table_customer");

const { MESSAGES, HTTP_STATUS_CODE } = require("../core/constant.response");
const {
  ConflictRequestError,
  OperationFailureError,
  MissingInputError,
  NotFoundError,
} = require("../core/error.response");
const { getInfoData } = require("../utils/index");
const { Op } = require("sequelize");

class TableService {
  static createTable = async (data) => {
    const tableExists = await Table.findOne({
      where: {
        number: data.number,
      },
    });
    if (tableExists) throw new ConflictRequestError(MESSAGES.TABLE.EXISTS);
    const tableNew = await Table.create({
      number: data.number,
      seat_number: data.seat_number,
      status: "available",
    });
    if (!tableNew) {
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.CREATE_FAILURE);
    }
    return getInfoData({
      fields: ["id", "number", "status", "seat_number"],
      object: tableNew,
    });
  };

  static bookingTable = async ({ listTable, customer_name, phone_number }) => {
    let listIdTable;
    try {
      listIdTable = await this.validateListTable(listTable, "available");
    } catch (error) {
      throw error;
    }
    // kiểm tra thông tin khách hàng đã tồn tại trong db chưa
    const customerExists = await Customer.findOne({
      where: {
        phone_number,
      },
    });
    let customer_id;
    // neu chua ton tai => tao customer moi
    if (!customerExists) {
      const customerNew = await Customer.create({
        full_name: customer_name,
        phone_number,
      });
      if (!customerNew)
        throw new OperationFailureError(MESSAGES.TABLE.BOOKING_FAIL);
      customer_id = customerNew.id;
    } else {
      customer_id = customerExists.id;
    }
    // neu ton tai => update customer_id trong Table_Customer
    const [rowUpdated] = await Table.update(
      {
        status: "occupied",
      },
      {
        where: {
          id: {
            [Op.in]: listIdTable,
          },
        },
      }
    );

    const listTableCustomerInsert = listIdTable.map((tableId) => {
      return {
        table_id: tableId,
        customer_id,
      };
    });
    await TableCustomer.bulkCreate(listTableCustomerInsert);
    if (rowUpdated === 0)
      throw new OperationFailureError(MESSAGES.TABLE.BOOKING_FAIL);
    return MESSAGES.TABLE.BOOKING_SUCCESSFULLY;
  };

  static getAll = async ({ page, limit, status, seat_number }) => {
    const queries = {
      offset: (page - 1) * limit,
      limit,
    };
    if (status) {
      queries.where = {
        status: { [Op.like]: status },
      };
    }
    if (seat_number) {
      queries.where = {
        ...queries.where,
        seat_number: { [Op.eq]: seat_number },
      };
    }
    const { count, rows } = await Table.findAndCountAll({
      ...queries,
      include: [
        {
          model: Customer,
          attributes: ["id", "full_name", "phone_number"],
        },
      ],
      raw: true,
      nest: true,
    });
    let listTables = [];

    if (count > 0) {
      listTables = rows.map((table) => {
        const data = getInfoData({
          fields: ["id", "number", "status", "seat_number"],
          object: table,
        });
        if (table.Customers?.full_name && table.Customers?.phone_number) {
          data.customer = {
            customer_id: table.Customers.id,
            full_name: table.Customers.full_name,
            phone_number: table.Customers.phone_number,
          };
        }
        return data;
      });
      // console.log("check data::", listTables);
      return {
        total: count,
        page,
        limit,
        status,
        totalPage: Math.ceil(count / limit),
        listTables,
      };
    }
    return {
      total: 0,
      page,
      limit,
      status,
      totalPage: 0,
      listTables: [],
    };
  };

  static getById = async (tableId) => {
    if (!tableId) throw new MissingInputError(MESSAGES.TABLE.TABLE_ID);
    const tableExists = await Table.findByPk(tableId, {
      include: [
        {
          model: FoodMenu,
          through: {
            attributes: ["quantity"],
          },
          attributes: ["id", "name", "image_url", "price"],
          include: [
            {
              model: FoodCategory,
              attributes: ["name"],
            },
            {
              model: Unit,
              attributes: ["name"],
            },
          ],
        },
        {
          model: Customer,
          through: {},
        },
      ],
      raw: false,
      nest: true,
    });

    if (!tableExists) {
      throw new NotFoundError(MESSAGES.TABLE.NOT_FOUND);
    }
    const data = getInfoData({
      fields: ["id", "number", "status", "seat_number"],
      object: tableExists,
    });
    if (tableExists.FoodMenus.length > 0) {
      data.listFood = tableExists.FoodMenus.map((food) => {
        return {
          id: food.id,
          name: food.name,
          image_url: food.image_url,
          price: food.price,
          category: food.FoodCategory.name,
          unit: food.Unit.name,
        };
      });
    }
    if (tableExists.Customers) {
      data.customer = {
        full_name: tableExists.Customers[0]?.full_name,
        phone_number: tableExists.Customers[0]?.phone_number,
      };
    }
    return data;
  };

  static orderFoodByTable = async ({ tableId, listFood }) => {
    const tableExists = await Table.findOne({
      where: {
        id: tableId,
      },
    });
    if (!tableExists) {
      throw new NotFoundError(MESSAGES.TABLE.NOT_FOUND);
    }
    // luu vao bang table_food_menu
    if (listFood.length <= 0) {
      throw new OperationFailureError(MESSAGES.TABLE.ORDER_FOOD_FAIL);
    }

    for (const food of listFood) {
      const [record, created] = await Table_FoodMenu.findOrCreate({
        where: {
          table_id: tableId,
          food_menu_id: food.id,
        },
        defaults: {
          quantity: food.quantity,
        },
      });
      if (!created) {
        await record.increment("quantity", { by: food.quantity });
      }
    }
    return MESSAGES.TABLE.ORDER_FOOD_SUCCESS;
  };

  static validateListTable = async (listTables, status) => {
    const listIdTable = listTables.map((table) => table.id);
    const countIdTable = await Table.count({
      where: {
        id: {
          [Op.in]: listIdTable,
        },
        status,
      },
    });
    if (countIdTable < listTables.length) {
      throw new MissingInputError(
        MESSAGES.ERROR.INVALID_INPUT,
        HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
        { tableId: MESSAGES.TABLE.TABLE_ID }
      );
    }
    return listIdTable;
  };
  // Khi nhấn nút tạo hóa đơn sẽ lấy ra danh sách các món theo bàn
  static getListFoodByTable = async ({ listTables }) => {
    let listIdTable;
    try {
      listIdTable = await this.validateListTable(listTables, "occupied");
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
            attributes: ["quantity"],
          },
          attributes: ["id", "name", "image_url", "price"],
          include: [
            {
              model: Unit,
              attributes: ["name"],
            },
          ],
        },
        {
          model: Customer,
        },
      ],
      raw: true,
      nest: true,
    });
    // console.log("check list table::", listTable);
    const data = listTable.map((table) => {
      return {
        tableId: table.id,
        number: table.number,
        status: table.status,
        customer_id: table.Customers?.id,
        customer_name: table.Customers?.full_name,
        phone_number: table.Customers.phone_number,
        seat_number: table.seat_number,
        listFoods: table.FoodMenus
          ? [
              {
                id: table.FoodMenus.id,
                name: table.FoodMenus.name,
                image_url: table.FoodMenus.image_url,
                price: table.FoodMenus.price,
                quantity: table.FoodMenus.Table_FoodMenu
                  ? table.FoodMenus.Table_FoodMenu.quantity
                  : 0,
                unit: table.FoodMenus?.Unit?.name,
              },
            ]
          : [],
      };
    });

    // Gộp các món ăn có cùng tableId
    const groupedData = data.reduce((acc, curr) => {
      const existingTable = acc.find((item) => item.tableId === curr.tableId);
      if (existingTable) {
        existingTable.listFoods.push(...curr.listFoods);
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    return groupedData;
  };

  static updateListFoodByTable = async (listTables) => {
    const listIdTable = listTables.map((table) => table.tableId);
    const countIdTable = await Table.count({
      where: {
        id: {
          [Op.in]: listIdTable,
        },
        status: "occupied",
      },
    });

    if (countIdTable < listTables.length) {
      throw new MissingInputError(
        MESSAGES.ERROR.INVALID_INPUT,
        HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
        { tableId: MESSAGES.TABLE.TABLE_ID }
      );
    }
    for (let table of listTables) {
      for (let food of table.listFoods) {
        const [record, created] = await Table_FoodMenu.findOrCreate({
          where: {
            table_id: table.tableId,
            food_menu_id: food.id,
          },
          defaults: {
            quantity: food.quantity,
          },
        });

        if (!created) {
          await record.update({ quantity: food.quantity });
        }
      }
    }
    return MESSAGES.TABLE.UPDATE_ORDER_FOOD_SUCCESS;
  };

  static deleteTableFoodMenuById = async (listIdTableFoodMenu) => {
    await Table_FoodMenu.destroy({
      where: {
        id: {
          [Op.in]: listIdTableFoodMenu,
        },
      },
    });
  };
}

module.exports = TableService;
