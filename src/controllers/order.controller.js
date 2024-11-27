"use strict";

const { MESSAGES, HTTP_STATUS_CODE } = require("../core/constant.response");
const { Created } = require("../core/success.response");

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
}

module.exports = OrderController;
