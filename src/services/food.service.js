"use strict";

const FoodMenu = require("../models/food_menu");
const Unit = require("../models/unit");
const FoodCategory = require("../models/food_category");
const { MESSAGES } = require("../core/constant.response");
const {
  ConflictRequestError,
  OperationFailureError,
  NotFoundError,
} = require("../core/error.response");
const { getInfoData } = require("../utils/index");
const deleteFileCloudinary = require("../utils/deleteFileCloudinary");
const { Op } = require("sequelize");
const getDateTime = require("../utils/getDatetime");

class FoodService {
  static createFood = async (data) => {
    const foodExists = await FoodMenu.findOne({
      where: { name: data.name },
    });
    if (foodExists) {
      if (data.fileImage) {
        deleteFileCloudinary(data.fileImage.filename);
      }
      throw new ConflictRequestError(MESSAGES.FOOD.EXISTS);
    }
    let image_url = "";
    if (data.fileImage) image_url = data.fileImage.path;
    const foodNew = await FoodMenu.create({
      name: data.name,
      image_url,
      price: data.price,
      category_id: data.category_id,
      unit_id: data.unit_id,
    });
    if (!foodNew) {
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.CREATE_FAILURE);
    }
    return getInfoData({
      fields: ["id", "name", "image_url", "price"],
      object: foodNew,
    });
  };

  static updateFood = async (foodId, dataUpdate, fileImage) => {
    const foodExists = await FoodMenu.findByPk(foodId);
    if (!foodExists) {
      if (fileImage) {
        deleteFileCloudinary(fileImage.filename);
      }
      throw new NotFoundError(MESSAGES.FOOD.NOT_FOUND);
    }
    const data = { ...dataUpdate };
    data.image_url = fileImage?.path || "";

    const [rowUpdated] = await FoodMenu.update(data, { where: { id: foodId } });
    if (rowUpdated === 0) {
      if (fileImage) {
        deleteFileCloudinary(fileImage.filename);
      }
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.UPDATE_FAILURE);
    }
    return MESSAGES.SUCCESS.UPDATE;
  };

  static getById = async (foodId) => {
    const foodExists = await FoodMenu.findByPk(foodId, {
      include: [
        {
          model: Unit,
          attributes: ["name"],
        },
        {
          model: FoodCategory,
          attributes: ["name"],
        },
      ],
      raw: true,
      nest: true,
    });
    if (!foodExists) {
      throw new NotFoundError(MESSAGES.FOOD.NOT_FOUND);
    }
    const data = getInfoData({
      fields: ["id", "name", "image_url", "price"],
      object: foodExists,
    });
    data.unit = foodExists.Unit.name;
    data.category = foodExists.FoodCategory.name;
    data.createdAt = getDateTime(foodExists.createdAt);
    return data;
  };

  static getAllFoods = async ({ page, limit, sortBy, orderBy, keyword }) => {
    const queries = {
      offset: (page - 1) * limit,
      limit,
    };
    if (sortBy) {
      queries.order = [[sortBy, orderBy]];
    }
    if (keyword) {
      queries.where = {
        name: { [Op.substring]: keyword },
      };
    }
    console.log("check query::", queries);
    const { count, rows } = await FoodMenu.findAndCountAll({
      ...queries,
      include: [
        {
          model: Unit,
          attributes: ["name"],
        },
        {
          model: FoodCategory,
          attributes: ["name"],
        },
      ],
      raw: true,
      nest: true,
    });
    // console.log("check result::", rows);
    if (count > 0) {
      const listFoods = rows.map((food) => {
        const data = getInfoData({
          fields: ["id", "name", "image_url", "price"],
          object: food,
        });
        data.unit = food.Unit.name;
        data.category = food.FoodCategory.name;
        data.createdAt = getDateTime(food.createdAt);
        return data;
      });
      return {
        total: listFoods.length,
        page,
        limit,
        totalPage: Math.ceil(count / limit),
        listFoods,
      };
    }
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      listFoods: [],
    };
  };

  static getAllByCategory = async (
    { page, limit, sortBy, orderBy, keyword },
    foodCategoryId
  ) => {
    const queries = {
      offset: (page - 1) * limit,
      limit,
    };
    if (sortBy) {
      queries.order = [[sortBy, orderBy]];
    }
    if (keyword) {
      queries.where = {
        name: { [Op.substring]: keyword },
      };
    }
    queries.where = {
      ...queries.where,
      category_id: foodCategoryId,
    };
    const { count, rows } = await FoodMenu.findAndCountAll({
      ...queries,
      include: [
        {
          model: Unit,
          attributes: ["name"],
        },
        {
          model: FoodCategory,
          attributes: ["name"],
        },
      ],
      raw: true,
      nest: true,
    });
    // console.log("check result::", rows);
    if (count > 0) {
      const listFoods = rows.map((food) => {
        const data = getInfoData({
          fields: ["id", "name", "image_url", "price"],
          object: food,
        });
        data.unit = food.Unit.name;
        data.category = food.FoodCategory.name;
        data.createdAt = getDateTime(food.createdAt);
        return data;
      });
      return {
        total: listFoods.length,
        page,
        limit,
        totalPage: Math.ceil(count / limit),
        listFoods,
      };
    }
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      listFoods: [],
    };
  };

  static deleteFood = async (foodId) => {
    const foodExists = await FoodMenu.findByPk(foodId);
    if (!foodExists) {
      throw new NotFoundError(MESSAGES.FOOD.NOT_FOUND);
    }
    const rowDeleted = await FoodMenu.destroy({
      where: { id: foodId },
    });
    if (rowDeleted === 0)
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.DELETE_FAILURE);
    return MESSAGES.SUCCESS.DELETE;
  };

  static deleteFoodByCateFoodId = async (foodCategoryId) => {
    const rowDeleted = await FoodMenu.destroy({
      where: { category_id: foodCategoryId },
    });
    if (rowDeleted === 0) return false;
    return true;
  };
}
module.exports = FoodService;
