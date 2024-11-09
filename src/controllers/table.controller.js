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

  static updateTable = async (req, res, next) => {};
}

module.exports = TableController;
