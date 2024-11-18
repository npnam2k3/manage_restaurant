"use strict";
const CustomerService = require("../services/customer.service");
const { Created, SuccessResponse } = require("../core/success.response");
const { MESSAGES, HTTP_STATUS_CODE } = require("../core/constant.response");

class CustomerController {
  static createCustomer = async (req, res, next) => {
    // console.log("check customer validate::", req.validatedData);
    const response = await CustomerService.createCustomer(req.validatedData);
    new Created(
      MESSAGES.SUCCESS.CREATED,
      HTTP_STATUS_CODE.CREATED,
      response
    ).send(res);
  };

  static updateCustomer = async (req, res, next) => {
    const customerId = parseInt(req.params.customerId);
    // console.log("check data update validate::", req.validatedData);
    const response = await CustomerService.updateCustomer(
      customerId,
      req.validatedData
    );
    new SuccessResponse(response, HTTP_STATUS_CODE.OK).send(res);
  };

  static getCustomerById = async (req, res, next) => {
    const customerId = parseInt(req.params.customerId);
    const response = await CustomerService.getCustomerById(customerId);
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };

  static getAllCustomers = async (req, res, next) => {
    const { page, limit, sortBy, orderBy, keyword } = req.query;
    const listCustomer = await CustomerService.getAllCustomers({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || +process.env.LIMIT_RECORD_CUSTOMER,
      sortBy,
      orderBy: orderBy?.toUpperCase() === "DESC" ? "DESC" : "ASC",
      keyword,
    });
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      listCustomer
    ).send(res);
  };

  static deleteCustomer = async (req, res, next) => {
    const customerId = parseInt(req.params.customerId);
    const response = await CustomerService.deleteUser(customerId);
    new SuccessResponse(response, HTTP_STATUS_CODE.OK).send(res);
  };
}

module.exports = CustomerController;
