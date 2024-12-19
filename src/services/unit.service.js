"use strict";

const Unit = require("../models/unit");
const { MESSAGES } = require("../core/constant.response");
const {
  ConflictRequestError,
  OperationFailureError,
  NotFoundError,
} = require("../core/error.response");
const { getInfoData } = require("../utils/index");

class UnitService {
  static create = async (data) => {
    const unitExists = await Unit.findOne({
      where: {
        name: data.name,
      },
    });
    if (unitExists) {
      throw new ConflictRequestError(MESSAGES.UNIT.EXISTS);
    }
    const unitNew = await Unit.create({
      name: data.name,
      description: data.description || "",
    });
    if (!unitNew)
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.CREATE_FAILURE);
    return getInfoData({
      fields: ["id", "name", "description"],
      object: unitNew,
    });
  };

  static update = async (unitId, dataUpdate) => {
    const unitExists = await Unit.findByPk(unitId);
    if (!unitExists) throw new NotFoundError(MESSAGES.UNIT.NOT_FOUND);
    const [rowUpdated] = await Unit.update(dataUpdate, {
      where: {
        id: unitId,
      },
    });
    if (rowUpdated === 0)
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.UPDATE_FAILURE);
    return MESSAGES.SUCCESS.UPDATE;
  };

  static getById = async (unitId) => {
    const unitExists = await Unit.findByPk(unitId);
    if (!unitExists) throw new NotFoundError(MESSAGES.UNIT.NOT_FOUND);
    return getInfoData({
      fields: ["id", "name", "description"],
      object: unitExists,
    });
  };

  static getAll = async ({ page, limit }) => {
    let queries = {};
    if (page && limit) {
      queries = {
        offset: (page - 1) * limit,
        limit,
      };
    }
    const { count, rows } = await Unit.findAndCountAll({
      ...queries,
      raw: true,
    });
    if (count > 0) {
      const listUnits = rows.map((unit) =>
        getInfoData({
          fields: ["id", "name", "description"],
          object: unit,
        })
      );
      return {
        total: listUnits.length,
        page,
        limit,
        totalPage: limit ? Math.ceil(count / limit) : 1,
        listUnits,
      };
    }
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      listUnits: [],
    };
  };
}

module.exports = UnitService;
