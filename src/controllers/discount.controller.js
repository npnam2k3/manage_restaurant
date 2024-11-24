"use strict";

const DiscountService = require("../services/discount.service");
const { Created, SuccessResponse } = require("../core/success.response");
const { MESSAGES, HTTP_STATUS_CODE } = require("../core/constant.response");

class DiscountController {
  static createDiscount = async (req, res) => {
    const response = await DiscountService.createDiscount(req.validatedData);
    new Created(
      MESSAGES.SUCCESS.CREATED,
      HTTP_STATUS_CODE.CREATED,
      response
    ).send(res);
  };

  static updateDiscount = async (req, res) => {
    const discountId = parseInt(req.params.discountId);
    const response = await DiscountService.updateDiscount(
      discountId,
      req.validatedData
    );
    new SuccessResponse(response).send(res);
  };

  static getAll = async (req, res) => {
    const { page, limit } = req.query;
    const listDiscounts = await DiscountService.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || +process.env.LIMIT_RECORD_DISCOUNT,
    });
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      listDiscounts
    ).send(res);
  };

  static getById = async (req, res) => {
    const discountId = parseInt(req.params.discountId);
    const response = await DiscountService.getById(discountId);
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };
}

module.exports = DiscountController;
