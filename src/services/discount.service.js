"use strict";
const Discount = require("../models/discount");
const Order = require("../models/order");
const Table = require("../models/table");
const Customer = require("../models/customer");
const CustomerDiscount = require("../models/customer_discount");

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
const { Op, Sequelize, fn, col, where } = require("sequelize");
const { convertToDate } = require("../utils/formatDate");

class DiscountService {
  static DISCOUNT_TYPE = {
    PERCENTAGE: "percentage",
    AMOUNT: "amount",
  };
  static DISCOUNT_AMOUNT = {
    MAX_PERCENTAGE: 70, // 70%,
    MIN_AMOUNT: 50000, // 50K
  };

  static DISCOUNT_STATUS = {
    ACTIVE: "active",
    USED: "used",
    EXPIRED: "expired",
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

  static checkValueDiscountDuplicate = async (data, discountId = null) => {
    const error = {};
    const today = convertToDate(new Date());
    const conditions =
      data.is_loyalty_customer === 1
        ? [
            { discount_amount: { [Op.eq]: data.discount_amount } },
            { total_money_spent: { [Op.eq]: data.total_money_spent } },
          ]
        : [
            { discount_amount: { [Op.eq]: data.discount_amount } },
            { min_order_value: { [Op.eq]: data.min_order_value } },
          ];

    const whereConditions = {
      [Op.or]: conditions,
      [Op.and]: [
        where(fn("DATE", col("end_date")), { [Op.gte]: today }),
        { is_loyalty_customer: data.is_loyalty_customer },
      ],
    };

    if (discountId !== null) {
      whereConditions.id = { [Op.ne]: discountId };
    }

    const discountExists = await Discount.findOne({ where: whereConditions });

    // console.log("check exists::", discountExists);
    if (discountExists) {
      error[
        data.is_loyalty_customer === 1
          ? "loyalCustomerDiscount"
          : "normalDiscount"
      ] =
        data.is_loyalty_customer === 1
          ? MESSAGES.DISCOUNT.VALUE_DISCOUNT_LOYALTY_CUS_EXISTS
          : MESSAGES.DISCOUNT.VALUE_DISCOUNT_NORMAL_EXISTS;
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
    await this.checkValueDiscountDuplicate(data);

    if (data.is_loyalty_customer && !data.total_money_spent) {
      throw new DiscountInvalid(
        MESSAGES.ERROR.INVALID_INPUT,
        HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
        {
          totalMoneySpent: MESSAGES.DISCOUNT.TOTAL_MONEY_SPENT,
        }
      );
    }
    const newDiscount = await Discount.create({
      code: data.code,
      description: data.description || null,
      discount_amount: data.discount_amount,
      discount_type: data.discount_type,
      min_order_value: data.min_order_value || null,
      start_date: data.start_date,
      end_date: data.end_date,
      is_anniversary: data.is_anniversary,
      is_loyalty_customer: data.is_loyalty_customer,
      total_money_spent: data.total_money_spent || null,
    });
    if (newDiscount && newDiscount.is_loyalty_customer === 1) {
      this.calcLoyaltyCustomer(newDiscount.total_money_spent, newDiscount.id);
    }
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
      await this.checkValueDiscountDuplicate(dataUpdate, discountId);
    } else if (dataUpdate.discount_type) {
      const dataValidate = {
        discount_type: dataUpdate.discount_type,
        discount_amount: discountExists.discount_amount,
      };
      this.validateDiscount(dataValidate);
      await this.checkValueDiscountDuplicate(dataUpdate, discountId);
    } else if (dataUpdate.discount_amount) {
      const dataValidate = {
        discount_type: discountExists.discount_type,
        discount_amount: dataUpdate.discount_amount,
      };
      this.validateDiscount(dataValidate);
      await this.checkValueDiscountDuplicate(dataUpdate, discountId);
    }

    if (dataUpdate.is_loyalty_customer === 1 && !dataUpdate.total_money_spent) {
      throw new DiscountInvalid(
        MESSAGES.ERROR.INVALID_INPUT,
        HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
        {
          totalMoneySpent: MESSAGES.DISCOUNT.TOTAL_MONEY_SPENT,
        }
      );
    }
    const [rowUpdate] = await Discount.update(dataUpdate, {
      where: {
        id: discountId,
      },
    });

    if (rowUpdate === 0)
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.UPDATE_FAILURE);

    // trường hợp discount cũ là normal và muốn sửa thành discount dành cho khtt
    if (
      dataUpdate.is_loyalty_customer === 1 &&
      discountExists.is_loyalty_customer === 0
    ) {
      this.calcLoyaltyCustomer(dataUpdate.total_money_spent, discountId);
    }

    //  trường hợp discount cũ là dành cho khtt mà muốn sửa lại thành normal
    //   thì xóa danh sách khtt trong bảng trung gian đi
    if (
      discountExists.is_loyalty_customer === 1 &&
      dataUpdate.is_loyalty_customer === 0
    ) {
      this.deleteDiscountForCustomer(discountId);
    }

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

  static calcLoyaltyCustomer = async (totalMoneySpent, discountId) => {
    const listCustomer = await Customer.findAll({
      include: [
        {
          model: Order,
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.fn("SUM", Sequelize.col("Orders.total_price")),
            "totalSpent",
          ],
        ],
      },
      group: ["Customer.id"],
      having: Sequelize.where(
        Sequelize.fn("SUM", Sequelize.col("Orders.total_price")),
        { [Op.gte]: totalMoneySpent }
      ),
    });
    // console.log("check data::", listCustomer);
    const dataInsert = listCustomer.map((item) => {
      return {
        customer_id: item.id,
        discount_id: discountId,
        status: this.DISCOUNT_STATUS.ACTIVE,
      };
    });
    await CustomerDiscount.bulkCreate(dataInsert);
  };

  // tìm danh sach các discount đang còn hiệu lực
  static findDiscount = async () => {
    const today = convertToDate(new Date());
    const listDiscounts = await Discount.findAll({
      where: {
        [Op.and]: [
          where(fn("DATE", col("start_date")), { [Op.lte]: today }),
          where(fn("DATE", col("end_date")), { [Op.gte]: today }),
        ],
      },
      raw: true,
    });
    return listDiscounts;
  };

  // phân loại discount: dành cho khtt và normal
  static classifyDiscount = async () => {
    const listDiscounts = await this.findDiscount();
    let listDiscountForLoyaltyCus = [];
    let listDiscountNormal = [];
    listDiscounts.forEach((discount) => {
      if (discount.is_loyalty_customer === 1) {
        listDiscountForLoyaltyCus.push(discount);
      } else {
        listDiscountNormal.push(discount);
      }
    });
    return { listDiscountForLoyaltyCus, listDiscountNormal };
  };

  static findDiscountOfLoyaltyCustomer = async (customerId) => {
    const today = convertToDate(new Date());
    const listDiscounts = await CustomerDiscount.findAll({
      attributes: ["customer_id", "discount_id"],
      include: [
        {
          model: Discount,
          where: {
            [Op.and]: [
              where(fn("DATE", col("start_date")), { [Op.lte]: today }),
              where(fn("DATE", col("end_date")), { [Op.gte]: today }),
            ],
          },
        },
        {
          model: Customer,
          attributes: ["id"],
        },
      ],
      where: {
        status: "active",
        customer_id: customerId,
      },
      raw: true,
      nest: true,
    });
    return listDiscounts;
  };

  // tim discount co gia tri cao nhat cho khach hang tt
  static findMaxValueDiscountForLoyalCus = (listDiscounts, totalPrice) => {
    if (listDiscounts.length > 0) {
      const listAmount = listDiscounts.map((discount) => {
        const amountObj = {
          discountId: discount.Discount?.id,
          discount_amount: discount.Discount?.discount_amount,
          discount_type: discount.Discount?.discount_type,
        };
        if (
          discount.Discount?.discount_type === this.DISCOUNT_TYPE.PERCENTAGE
        ) {
          amountObj.saleAmount =
            totalPrice * (discount.Discount?.discount_amount / 100);
        } else {
          amountObj.saleAmount = discount.Discount?.discount_amount;
        }
        return amountObj;
      });
      let maxItem = { saleAmount: 0 };

      for (let amount of listAmount) {
        if (amount.saleAmount > maxItem.saleAmount) {
          maxItem = amount;
        }
      }

      return maxItem;
    }
    return null;
  };

  // tim discount co gia tri cao nhat normal
  static findMaxValueDiscountNormal = (listDiscounts, totalPrice) => {
    if (listDiscounts.length > 0) {
      const listAmount = listDiscounts.map((discount) => {
        const amountObj = {
          discountId: discount.id,
          discount_amount: discount.discount_amount,
          discount_type: discount.discount_type,
        };
        if (discount.discount_type === this.DISCOUNT_TYPE.PERCENTAGE) {
          amountObj.saleAmount = totalPrice * (discount.discount_amount / 100);
        } else {
          amountObj.saleAmount = discount.discount_amount;
        }
        return amountObj;
      });
      let maxItem = { saleAmount: 0 };

      for (let amount of listAmount) {
        if (amount.saleAmount > maxItem.saleAmount) {
          maxItem = amount;
        }
      }

      return maxItem;
    }
    return null;
  };

  // update status discount danh cho khtt (discount cho khtt chi dung 1 lan)
  static updateStatusDiscountForLoyalCus = async (customerId, discountId) => {
    await CustomerDiscount.update(
      {
        status: this.DISCOUNT_STATUS.USED,
      },
      {
        where: {
          customer_id: customerId,
          discount_id: discountId,
          status: this.DISCOUNT_STATUS.ACTIVE,
        },
      }
    );
  };

  static deleteDiscountForCustomer = async (discountId) => {
    await CustomerDiscount.destroy({
      where: {
        discount_id: discountId,
      },
      force: true,
    });
  };
}
module.exports = DiscountService;
