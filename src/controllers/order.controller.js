"use strict";

const { MESSAGES, HTTP_STATUS_CODE } = require("../core/constant.response");
const { Created, SuccessResponse } = require("../core/success.response");

const OrderService = require("../services/order.service");
class OrderController {
  static createOrder = async (req, res) => {
    const response = await OrderService.createOrder(req.validatedData);
    new Created(
      MESSAGES.SUCCESS.CREATED,
      HTTP_STATUS_CODE.CREATED,
      response
    ).send(res);
  };
  static getAll = async (req, res) => {
    const { page, limit, sortBy, orderBy, customerName, dateFind } = req.query;
    const response = await OrderService.getAllOrder({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || +process.env.LIMIT_RECORD_CUSTOMER,
      sortBy: sortBy || "createdAt",
      orderBy: orderBy?.toUpperCase() === "DESC" ? "DESC" : "ASC",
      customerName,
      dateFind,
    });
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };

  static getById = async (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const response = await OrderService.getById(orderId);
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };
}

module.exports = OrderController;
