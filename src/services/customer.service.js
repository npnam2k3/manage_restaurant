"use strict";
const Customer = require("../models/customer");
const { MESSAGES, HTTP_STATUS_CODE } = require("../core/constant.response");
const {
  ConflictRequestError,
  OperationFailureError,
  NotFoundError,
} = require("../core/error.response");
const { getInfoData } = require("../utils/index");
const { Op } = require("sequelize");
const getDateTime = require("../utils/getDatetime");

class CustomerService {
  static createCustomer = async (data) => {
    const customerExists = await Customer.findOne({
      where: { phone_number: data.phone_number },
      raw: true,
    });
    // console.log("check customer exists::", customerExists);
    if (customerExists) {
      throw new ConflictRequestError(MESSAGES.CUSTOMER.EXISTS);
    }
    const customerNew = await Customer.create({
      full_name: data.full_name,
      phone_number: data.phone_number,
    });
    if (!customerNew) {
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.CREATE_FAILURE);
    }
    // console.log("check customer new from service::", customerNew);
    return getInfoData({
      fields: ["id", "full_name", "phone_number"],
      object: customerNew,
    });
  };

  static updateCustomer = async (customerId, dataUpdate) => {
    const customerExists = await Customer.findByPk(customerId);
    if (!customerExists) {
      throw new NotFoundError(MESSAGES.CUSTOMER.NOT_FOUND);
    }
    if (dataUpdate.phone_number) {
      const phoneExists = await Customer.count({
        where: {
          phone_number: dataUpdate.phone_number,
          id: {
            [Op.ne]: customerId,
          },
        },
      });

      if (phoneExists > 0) {
        const err = {
          phone_number: MESSAGES.CUSTOMER.PHONE_NUMBER_EXISTS,
        };
        throw new ConflictRequestError(
          MESSAGES.ERROR.CONFLICT,
          HTTP_STATUS_CODE.CONFLICT,
          err
        );
      }
    }
    const [rowUpdated] = await Customer.update(dataUpdate, {
      where: { id: customerId },
    });
    if (rowUpdated === 0) {
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.UPDATE_FAILURE);
    }
    return MESSAGES.SUCCESS.UPDATE;
  };

  static getCustomerById = async (customerId) => {
    const customerInfo = await Customer.findByPk(customerId);
    if (!customerInfo) throw new NotFoundError(MESSAGES.CUSTOMER.NOT_FOUND);
    const data = getInfoData({
      fields: ["id", "full_name", "phone_number", "order_count"],
      object: customerInfo,
    });
    data.createdAt = getDateTime(customerInfo.createdAt);
    return data;
  };

  static getAllCustomers = async ({
    page,
    limit,
    sortBy,
    orderBy,
    keyword,
  }) => {
    const queries = {
      offset: (page - 1) * limit,
      limit,
    };
    if (sortBy) {
      queries.order = [[sortBy, orderBy]];
    }
    if (keyword) {
      queries.where = {
        full_name: { [Op.substring]: keyword },
      };
    }
    const { count, rows } = await Customer.findAndCountAll({
      ...queries,
      raw: true,
    });
    if (count > 0) {
      const listCustomer = rows.map((customer) => {
        const data = getInfoData({
          fields: ["id", "full_name", "phone_number", "order_count"],
          object: customer,
        });
        data.createdAt = getDateTime(customer.createdAt);
        return data;
      });
      return {
        total: listCustomer.length,
        page,
        limit,
        totalPage: Math.ceil(count / limit),
        listCustomer,
      };
    }
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      listCustomer: [],
    };
  };

  static deleteUser = async (customerId) => {
    const customerInfo = await Customer.findByPk(customerId);
    if (!customerInfo) throw new NotFoundError(MESSAGES.CUSTOMER.NOT_FOUND);
    const rowDeleted = await Customer.destroy({
      where: {
        id: customerId,
      },
    });
    if (rowDeleted === 0)
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.DELETE_FAILURE);
    return MESSAGES.SUCCESS.DELETE;
  };
}

module.exports = CustomerService;
