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
const { Op, Sequelize } = require("sequelize");
const { formatDate, formatTime } = require("../utils/formatDate");
const moment = require("moment");

class TableService {
  static TABLE_STATUS = {
    OCCUPIED: "occupied",
    AVAILABLE: "available",
    RESERVED: "reserved",
  };
  static TYPE_BOOKING = {
    DIRECT: "direct",
    REMOTE: "remote",
  };
  static MIN_DURATION = 5;
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
    });
    if (!tableNew) {
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.CREATE_FAILURE);
    }
    return getInfoData({
      fields: ["id", "number", "seat_number"],
      object: tableNew,
    });
  };

  static checkTimeReserved = (type_booking, time_reserved) => {
    if (type_booking === this.TYPE_BOOKING.REMOTE && !time_reserved) {
      throw new MissingInputError(
        MESSAGES.ERROR.VALIDATION_DATA,
        HTTP_STATUS_CODE.BAD_REQUEST,
        {
          time_reserved: MESSAGES.TABLE.TIME_RESERVED,
        }
      );
    }
  };

  static checkTimeReservedValid = async (
    listTables,
    type_booking,
    time_reserved
  ) => {
    const listId = listTables.map((item) => item.id);
    const countTable = await Table.count({
      where: {
        id: {
          [Op.in]: listId,
        },
        deletedAt: null,
      },
    });
    if (countTable < listId.length) {
      throw new MissingInputError(
        MESSAGES.ERROR.INVALID_INPUT,
        HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
        { tableId: MESSAGES.TABLE.TABLE_ID }
      );
    }
    // tim cac ban trong bang table_customer co id nam trong listId
    const listTableFromDb = await Table.findAll({
      where: {
        id: {
          [Op.in]: listId,
        },
      },
      include: [
        {
          model: Customer,
          through: {
            attributes: ["time_reserved", "status"],
            where: {
              deletedAt: null,
            },
          },
          attributes: ["id", "full_name", "phone_number"],
          raw: true,
        },
      ],
      nest: true,
    });

    // console.log("list from db::", listTableFromDb[0].Customers);
    let list = [];
    for (let table of listTableFromDb) {
      if (table.Customers.length > 0) {
        for (let customer of table.Customers) {
          const cusObj = customer.toJSON();
          list.push({
            tableId: table.id,
            status: cusObj.Table_Customer?.status,
            number: table.number,
            customer: cusObj.full_name,
            time_reserved: cusObj.Table_Customer?.time_reserved,
          });
        }
      }
    }

    // console.log("list::", list);
    const errors = [];
    if (list.length > 0) {
      list.forEach((item) => {
        const tableObj = {
          tableId: item.tableId,
          table_number: item.number,
          time_reserved: formatDate(item.time_reserved),
          customer: item.customer,
          status: item.status,
        };
        if (item.status === this.TABLE_STATUS.OCCUPIED) {
          if (type_booking === this.TYPE_BOOKING.DIRECT) {
            errors.push({
              ...tableObj,
              msg: MESSAGES.TABLE.TABLE_OCCUPIED,
            });
          }

          if (type_booking === this.TYPE_BOOKING.REMOTE) {
            const { days, hours } = this.calcDuration(
              item.time_reserved,
              time_reserved
            );
            const totalHours = days * 24 + hours;
            if (totalHours < this.MIN_DURATION) {
              errors.push({
                ...tableObj,
                msg: MESSAGES.TABLE.TIME_RESERVED_MINIMUM,
              });
            }
          }
        }
        if (item.status === this.TABLE_STATUS.RESERVED) {
          if (type_booking === this.TYPE_BOOKING.REMOTE) {
            const { days, hours } = this.calcDuration(
              item.time_reserved,
              time_reserved
            );
            const totalHours = Math.abs(days) * 24 + Math.abs(hours);
            if (totalHours < this.MIN_DURATION) {
              errors.push({
                ...tableObj,
                msg: MESSAGES.TABLE.TIME_RESERVED_MINIMUM,
              });
            }
          }
          if (type_booking === this.TYPE_BOOKING.DIRECT) {
            const { days, hours } = this.calcDuration(
              formatDate(new Date()),
              item.time_reserved
            );
            // console.log(`days::${days} -- hours::${hours}`);
            const totalHours = days * 24 + hours;
            if (totalHours < this.MIN_DURATION) {
              errors.push({
                ...tableObj,
                msg: MESSAGES.TABLE.TIME_RESERVED_MINIMUM,
              });
            }
          }
        }
      });
    }
    if (errors.length > 0) {
      throw new ConflictRequestError(
        MESSAGES.ERROR.CONFLICT,
        HTTP_STATUS_CODE.CONFLICT,
        errors
      );
    }
  };

  static calcDuration = (startTime, endTime) => {
    const startTimeFormat = moment(startTime);
    const endTimeFormat = moment(endTime);

    const duration = moment.duration(endTimeFormat.diff(startTimeFormat));
    const days = duration.days();
    const hours = duration.hours();
    // console.log(`Check day:: ${days} -- hours:: ${hours}`);
    return { days, hours };
  };

  static bookingTable = async ({
    listTable,
    customer_name,
    phone_number,
    type_booking,
    time_reserved,
  }) => {
    let listIdTable = listTable.map((item) => item.id);
    this.checkTimeReserved(type_booking, time_reserved);
    await this.checkTimeReservedValid(listTable, type_booking, time_reserved);

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

    // luu thong tin cac ban khach dat vao bang trung gian
    const listTableCustomerInsert = listIdTable.map((tableId) => {
      const objInsert = {
        time_reserved:
          type_booking === this.TYPE_BOOKING.REMOTE
            ? formatDate(time_reserved)
            : formatDate(new Date()),
      };
      (objInsert.status =
        type_booking === this.TYPE_BOOKING.DIRECT
          ? this.TABLE_STATUS.OCCUPIED
          : this.TABLE_STATUS.RESERVED),
        (objInsert.table_id = tableId);
      objInsert.customer_id = customer_id;
      return objInsert;
    });

    await TableCustomer.bulkCreate(listTableCustomerInsert);
    return MESSAGES.TABLE.BOOKING_SUCCESSFULLY;
  };

  static getAll = async ({ page, limit, seat_number }) => {
    const queries = {
      offset: (page - 1) * limit,
      limit,
    };
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
          through: {
            attributes: [
              "id",
              "table_id",
              "customer_id",
              "time_reserved",
              "status",
            ],
            where: {
              deletedAt: null,
            },
          },
          attributes: ["id", "full_name", "phone_number"],
        },
      ],
      raw: true,
      nest: true,
      distinct: true,
    });

    let listTables = [];

    if (count > 0) {
      listTables = rows.reduce((acc, curr) => {
        const data = {
          id: curr.id,
          number: curr.number,
          seat_number: curr.seat_number,
          listCustomers: curr.Customers.id
            ? [
                {
                  table_customer_id: curr.Customers.Table_Customer.id,
                  customerId: curr.Customers.id,
                  full_name: curr.Customers.full_name,
                  phone_number: curr.Customers.phone_number,
                  time_reserved: formatDate(
                    curr.Customers.Table_Customer.time_reserved
                  ),
                  status: curr.Customers.Table_Customer.status,
                },
              ]
            : [],
        };
        const tableExists = acc.find((item) => item.id === curr.id);
        if (tableExists) {
          tableExists.listCustomers.push({
            table_customer_id: curr.Customers.Table_Customer.id,
            customerId: curr.Customers.id,
            full_name: curr.Customers.full_name,
            phone_number: curr.Customers.phone_number,
            time_reserved: formatDate(
              curr.Customers.Table_Customer.time_reserved
            ),
            status: curr.Customers.Table_Customer.status,
          });
        } else {
          acc.push(data);
        }
        return acc;
      }, []);

      return {
        total: count,
        page,
        limit,
        totalPage: Math.ceil(count / limit),
        listTables,
      };
    }
    return {
      total: 0,
      page,
      limit,
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
      ],
      raw: false,
      nest: true,
    });
    // console.log("check table exists::", tableExists);
    const customerOfTable = await TableCustomer.findAll({
      where: {
        table_id: tableId,
        deletedAt: null,
      },
      include: [{ model: Customer }],
      raw: true,
      nest: true,
    });
    // console.log("check customer::", customerOfTable);
    if (!tableExists) {
      throw new NotFoundError(MESSAGES.TABLE.NOT_FOUND);
    }
    const data = getInfoData({
      fields: ["id", "number", "seat_number"],
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
    if (customerOfTable.length > 0) {
      data.customers = customerOfTable.map((customer) => {
        return {
          customerId: customer.customer_id,
          full_name: customer.Customer?.full_name,
          phone_number: customer.Customer?.phone_number,
          status: customer.status,
          time_reserved: formatDate(customer.time_reserved),
        };
      });
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

  static validateListTableForPayment = async (listIdTable) => {
    const countIdTable = await TableCustomer.count({
      where: {
        table_id: {
          [Op.in]: listIdTable,
        },
        status: this.TABLE_STATUS.OCCUPIED,
      },
    });
    if (countIdTable < listIdTable.length) {
      throw new MissingInputError(
        MESSAGES.ERROR.INVALID_INPUT,
        HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
        { tableId: MESSAGES.TABLE.TABLE_ID }
      );
    }
  };

  // Khi nhấn nút tạo hóa đơn sẽ lấy ra danh sách các món theo bàn
  static getListFoodByTableForPayment = async ({ listTables }) => {
    const listIdTable = listTables.map((item) => item.id);
    try {
      await this.validateListTableForPayment(listIdTable);
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
      ],
      raw: true,
      nest: true,
    });
    const customer = await TableCustomer.findOne({
      where: {
        table_id: {
          [Op.in]: listIdTable,
        },
        status: this.TABLE_STATUS.OCCUPIED,
      },
      include: [{ model: Customer }],
      raw: true,
      nest: true,
    });
    // console.log("check list customer::", customer);
    const data = listTable.map((table) => {
      return {
        tableId: table.id,
        number: table.number,
        seat_number: table.seat_number,
        customer_id: customer.customer_id,
        customer_name: customer.Customer.full_name,
        phone_number: customer.Customer.phone_number,
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

  // sửa lại các món trên bàn khi thanh toán (trường hợp thiếu món)
  static updateListFoodByTable = async (listTables) => {
    const listIdTable = listTables.map((table) => table.tableId);
    await this.validateListTableForPayment(listIdTable);

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
        table_id: {
          [Op.in]: listIdTableFoodMenu,
        },
      },
    });
  };

  static deleteTableCustomer = async (listIdTable, customer_id) => {
    await TableCustomer.destroy({
      where: {
        table_id: {
          [Op.in]: listIdTable,
        },
        status: this.TABLE_STATUS.OCCUPIED,
        customer_id,
      },
    });
  };

  static cancelTable = async ({ listTableCustomerId }) => {
    const listIdTable = listTableCustomerId.map((item) => item.id);
    await this.validateListTableForCancelAndReceive(listIdTable);
    await TableCustomer.destroy({
      where: {
        id: {
          [Op.in]: listIdTable,
        },
      },
    });
    return MESSAGES.TABLE.CANCEL_TABLE_SUCCESS;
  };
  static customerReceiveTable = async ({ listTableCustomerId }) => {
    const listIdTable = listTableCustomerId.map((item) => item.id);
    await this.validateListTableForCancelAndReceive(listIdTable);
    await TableCustomer.update(
      {
        status: this.TABLE_STATUS.OCCUPIED,
      },
      {
        where: {
          id: {
            [Op.in]: listIdTable,
          },
        },
      }
    );
    return MESSAGES.SUCCESS.UPDATE;
  };

  static validateListTableForCancelAndReceive = async (listTableCustomerId) => {
    const countIdTable = await TableCustomer.count({
      where: {
        id: {
          [Op.in]: listTableCustomerId,
        },
        status: this.TABLE_STATUS.RESERVED,
      },
    });
    if (countIdTable < listTableCustomerId.length) {
      throw new MissingInputError(
        MESSAGES.ERROR.INVALID_INPUT,
        HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
        { tableId: MESSAGES.TABLE.TABLE_ID }
      );
    }
  };

  static findTableByStatus = async (status) => {
    let listTable;
    if (status === this.TABLE_STATUS.AVAILABLE) {
      // lay danh sach ban khong nam trong bang table_customer
      listTable = await Table.findAll({
        where: {
          id: {
            [Op.notIn]: Sequelize.literal(
              "(Select table_id From table_customer)"
            ),
          },
        },
        raw: true,
      });
    } else {
      listTable = await TableCustomer.findAll({
        where: {
          status,
        },
        include: [
          {
            model: Table,
          },
          {
            model: Customer,
          },
        ],
        raw: true,
        nest: true,
      });
    }

    let listCustomize = [];
    if (listTable.length > 0) {
      listCustomize = listTable.map((table) => {
        let data;
        status === this.TABLE_STATUS.AVAILABLE
          ? (data = {
              table_id: table.id,
              number: table.number,
              seat_number: table.seat_number,
              status: this.TABLE_STATUS.AVAILABLE,
            })
          : (data = {
              table_id: table.table_id,
              number: table.Table.number,
              seat_number: table.Table.seat_number,
              customer_id: table.Customer.id,
              full_name: table.Customer.full_name,
              phone_number: table.Customer.phone_number,
              time_reserved: formatDate(table.time_reserved),
              status: table.status,
            });
        return data;
      });
    }
    return {
      totalRecord: listCustomize.length,
      listCustomize,
    };
  };
}

module.exports = TableService;
