"use strict";

const UnitService = require("../services/unit.service");
const { MESSAGES, HTTP_STATUS_CODE } = require("../core/constant.response");
const { Created, SuccessResponse } = require("../core/success.response");

class UnitController {
  static create = async (req, res) => {
    const response = await UnitService.create(req.validatedData);
    new Created(
      MESSAGES.SUCCESS.CREATED,
      HTTP_STATUS_CODE.CREATED,
      response
    ).send(res);
  };

  static update = async (req, res) => {
    const unitId = parseInt(req.params.unitId);
    const response = await UnitService.update(unitId, req.validatedData);
    new SuccessResponse(response, HTTP_STATUS_CODE.OK).send(res);
  };

  static getById = async (req, res) => {
    const unitId = parseInt(req.params.unitId);
    const response = await UnitService.getById(unitId);
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };

  static getAll = async (req, res) => {
    const { page, limit } = req.query;
    const response = await UnitService.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || +process.env.LIMIT_RECORD_UNIT,
    });
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };
}

module.exports = UnitController;
