"use strict";

const TableService = require("../services/table.service");
const { Created, SuccessResponse } = require("../core/success.response");
const { HTTP_STATUS_CODE, MESSAGES } = require("../core/constant.response");

class TableController {
  static createTable = async (req, res, next) => {
    const response = await TableService.createTable(req.validatedData);
    new Created(
      MESSAGES.SUCCESS.CREATED,
      HTTP_STATUS_CODE.CREATED,
      response
    ).send(res);
  };

  static bookingTable = async (req, res, next) => {
    const tableId = parseInt(req.params.tableId);
    const response = await TableService.bookingTable(
      tableId,
      req.validatedData
    );
    new SuccessResponse(response, HTTP_STATUS_CODE.OK).send(res);
  };

  static getAll = async (req, res, next) => {
    const { page, limit, seat_number, status } = req.query;
    const response = await TableService.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || +process.env.LIMIT_RECORD_TABLE,
      seat_number,
      status: status?.toLowerCase(),
    });
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };

  static orderFoodByTable = async (req, res) => {
    const response = await TableService.orderFoodByTable(req.validatedData);
    new SuccessResponse(response, HTTP_STATUS_CODE.OK).send(res);
  };

  static updateOrderFoodByTable = async (req, res) => {
    const response = await TableService.updateOrderFoodByTable(
      req.validatedData
    );
    new SuccessResponse(response, HTTP_STATUS_CODE.OK).send(res);
  };

  static getById = async (req, res) => {
    const tableId = parseInt(req.params.tableId);
    const response = await TableService.getById(tableId);
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };
}

module.exports = TableController;
