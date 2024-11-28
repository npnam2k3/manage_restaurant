"use strict";
const Discount = require("../models/discount");
const Order = require("../models/order");
const Table = require("../models/table");
const Customer = require("../models/customer");

const { HTTP_STATUS_CODE, MESSAGES } = require("../core/constant.response");
const {
  ConflictRequestError,
  DiscountInvalid,
  OperationFailureError,
  MissingInputError,
  NotFoundError,
} = require("../core/error.response");
const { getInfoData } = require("../utils/index");
const getDateTime = require("../utils/getDatetime");
const { Op } = require("sequelize");

class DiscountService {
  static DISCOUNT_TYPE = {
    PERCENTAGE: "percentage",
    AMOUNT: "amount",
  };
  static DISCOUNT_AMOUNT = {
    MAX_PERCENTAGE: 70, // 70%,
    MIN_AMOUNT: 50000, // 50K
  };

  static validateDiscount = (data) => {
    const { discount_type, discount_amount } = data;
    const error = {};
    if (discount_type === this.DISCOUNT_TYPE.PERCENTAGE) {
      if (discount_amount > this.DISCOUNT_AMOUNT.MAX_PERCENTAGE) {
        error.percentage = MESSAGES.DISCOUNT.MAX_PERCENTAGE;
      }
    } else {
      if (discount_amount < this.DISCOUNT_AMOUNT.MIN_AMOUNT) {
        error.amount = MESSAGES.DISCOUNT.MIN_AMOUNT;
      }
    }
    if (Object.keys(error).length > 0) {
      throw new DiscountInvalid(
        MESSAGES.DISCOUNT.INVALID,
        HTTP_STATUS_CODE.BAD_REQUEST,
        error
      );
    }
  };
  static createDiscount = async (data) => {
    const discountExists = await Discount.findOne({
      where: {
        code: data.code,
      },
    });
    if (discountExists) {
      throw new ConflictRequestError(MESSAGES.DISCOUNT.EXISTS);
    }
    this.validateDiscount(data);
    const newDiscount = await Discount.create({
      code: data.code,
      description: data.description || null,
      discount_amount: data.discount_amount,
      discount_type: data.discount_type,
      min_order_value: data.min_order_value || null,
      start_date: data.start_date,
      end_date: data.end_date,
      is_anniversary: data.is_anniversary,
      is_loyalty_customer: data.is_loyalty_customer || null,
      total_money_spent: data.total_money_spent || null,
    });
    if (!newDiscount)
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.CREATE_FAILURE);
    const response = getInfoData({
      fields: [
        "id",
        "code",
        "description",
        "discount_amount",
        "discount_type",
        "min_order_value",
        "is_anniversary",
        "is_loyalty_customer",
        "total_money_spent",
      ],
      object: newDiscount,
    });
    response.start_date = getDateTime(newDiscount.start_date);
    response.end_date = getDateTime(newDiscount.end_date);
    response.created_at = getDateTime(newDiscount.createdAt);
    return response;
  };

  static updateDiscount = async (discountId, dataUpdate) => {
    if (!discountId) throw new MissingInputError(MESSAGES.DISCOUNT.ID);
    const discountExists = await Discount.findByPk(discountId);
    if (!discountExists) throw new NotFoundError(MESSAGES.DISCOUNT.NOT_FOUND);
    if (dataUpdate.discount_type && dataUpdate.discount_amount) {
      this.validateDiscount(dataUpdate);
    } else if (dataUpdate.discount_type) {
      const dataValidate = {
        discount_type: dataUpdate.discount_type,
        discount_amount: discountExists.discount_amount,
      };
      this.validateDiscount(dataValidate);
    } else if (dataUpdate.discount_amount) {
      const dataValidate = {
        discount_type: discountExists.discount_type,
        discount_amount: dataUpdate.discount_amount,
      };
      this.validateDiscount(dataValidate);
    }
    const [rowUpdate] = await Discount.update(dataUpdate, {
      where: {
        id: discountId,
      },
    });
    if (rowUpdate === 0)
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.UPDATE_FAILURE);
    return MESSAGES.SUCCESS.UPDATE;
  };
  static getAll = async ({ page, limit }) => {
    const queries = {
      offset: (page - 1) * limit,
      limit,
    };
    const { count, rows } = await Discount.findAndCountAll({
      ...queries,
      raw: true,
    });
    if (count > 0) {
      const listDiscounts = rows.map((discount) => {
        const data = getInfoData({
          fields: [
            "id",
            "code",
            "description",
            "discount_amount",
            "discount_type",
            "min_order_value",
            "is_anniversary",
            "total_money_spent",
            "is_loyalty_customer",
          ],
          object: discount,
        });
        data.start_date = getDateTime(discount.start_date);
        data.end_date = getDateTime(discount.end_date);
        data.createdAt = getDateTime(discount.createdAt);
        return data;
      });
      return {
        total: listDiscounts.length,
        page,
        limit,
        totalPage: Math.ceil(count / limit),
        listDiscounts,
      };
    }
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      listDiscounts: [],
    };
  };
  static getById = async (discountId) => {
    if (!discountId) throw new MissingInputError(MESSAGES.DISCOUNT.ID);
    const discountExists = await Discount.findByPk(discountId);
    if (!discountExists) throw new NotFoundError(MESSAGES.DISCOUNT.NOT_FOUND);
    const response = getInfoData({
      fields: [
        "id",
        "code",
        "description",
        "discount_amount",
        "discount_type",
        "min_order_value",
        "is_anniversary",
        "is_loyalty_customer",
        "total_money_spent",
      ],
      object: discountExists,
    });
    response.start_date = getDateTime(discountExists.start_date);
    response.end_date = getDateTime(discountExists.end_date);
    response.created_at = getDateTime(discountExists.createdAt);
    return response;
  };
}
module.exports = DiscountService;
