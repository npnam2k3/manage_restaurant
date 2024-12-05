"use strict";

const TableService = require("../services/table.service");
const { Created, SuccessResponse } = require("../core/success.response");
const { HTTP_STATUS_CODE, MESSAGES } = require("../core/constant.response");

class TableController {
  static createTable = async (req, res) => {
    const response = await TableService.createTable(req.validatedData);
    new Created(
      MESSAGES.SUCCESS.CREATED,
      HTTP_STATUS_CODE.CREATED,
      response
    ).send(res);
  };

  static bookingTable = async (req, res) => {
    const response = await TableService.bookingTable(req.validatedData);
    new SuccessResponse(response, HTTP_STATUS_CODE.OK).send(res);
  };

  static getAll = async (req, res) => {
    const { page, limit, seat_number } = req.query;
    const response = await TableService.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || +process.env.LIMIT_RECORD_TABLE,
      seat_number,
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

  static getById = async (req, res) => {
    const tableId = parseInt(req.params.tableId);
    const response = await TableService.getById(tableId);
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };

  static getListFoodByTable = async (req, res) => {
    const response = await TableService.getListFoodByTable(req.validatedData);
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };

  static updateListFoodByTable = async (req, res) => {
    const response = await TableService.updateListFoodByTable(
      req.validatedData
    );
    new SuccessResponse(response).send(res);
  };

  static cancelTable = async (req, res) => {
    const response = await TableService.cancelTable(req.validatedData);
    new SuccessResponse(response).send(res);
  };

  static customerReceiveTable = async (req, res) => {
    const response = await TableService.customerReceiveTable(req.validatedData);
    new SuccessResponse(response).send(res);
  };

  static findTableByStatus = async (req, res) => {
    const { status } = req.query;
    const response = await TableService.findTableByStatus(status);
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };
}

module.exports = TableController;
