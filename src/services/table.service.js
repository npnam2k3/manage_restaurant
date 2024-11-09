"use strict";
const Table = require("../models/table");
const { MESSAGES } = require("../core/constant.response");
const {
  ConflictRequestError,
  OperationFailureError,
} = require("../core/error.response");
const { getInfoData } = require("../utils/index");

class TableService {
  static createTable = async (data) => {
    const tableExists = await Table.findOne({
      where: {
        number: data.number,
      },
    });
    if (tableExists) throw new ConflictRequestError(MESSAGES.TABLE.EXISTS);
    const tableNew = await Table.create({
      number: data.number,
      customer_id: null,
      status: "available",
      reservation_time: null,
    });
    if (!tableNew) {
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.CREATE_FAILURE);
    }
    return getInfoData({
      fields: ["id", "number", "status", "customer_id", "reservation_time"],
      object: tableNew,
    });
  };

  static updateTable = async (tableId, dataUpdate) => {};
}

module.exports = TableService;
