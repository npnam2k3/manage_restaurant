"use strict";
const FoodCategory = require("../models/food_category");
const { MESSAGES } = require("../core/constant.response");
const {
  ConflictRequestError,
  OperationFailureError,
  NotFoundError,
} = require("../core/error.response");
const { getInfoData } = require("../utils/index");
const FoodService = require("../services/food.service");

class FoodCategoryService {
  static create = async (data) => {
    const categoryExists = await FoodCategory.findOne({
      where: {
        name: data.name,
      },
    });
    if (categoryExists)
      throw new ConflictRequestError(MESSAGES.FOOD_CATEGORY.EXISTS);
    const categoryNew = await FoodCategory.create({
      name: data.name,
    });
    if (!categoryNew)
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.CREATE_FAILURE);
    return getInfoData({
      fields: ["id", "name"],
      object: categoryNew,
    });
  };

  static update = async (foodCategoryId, dataUpdate) => {
    const foodCategoryExists = await FoodCategory.findByPk(foodCategoryId);
    if (!foodCategoryExists)
      throw new NotFoundError(MESSAGES.FOOD_CATEGORY.NOT_FOUND);
    const [rowUpdated] = await FoodCategory.update(dataUpdate, {
      where: {
        id: foodCategoryId,
      },
    });
    if (rowUpdated === 0)
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.UPDATE_FAILURE);
    return MESSAGES.SUCCESS.UPDATE;
  };

  static getById = async (
    { page, limit, sortBy, orderBy, keyword },
    foodCategoryId
  ) => {
    const foodCategoryExists = await FoodCategory.findByPk(foodCategoryId);
    if (!foodCategoryExists)
      throw new NotFoundError(MESSAGES.FOOD_CATEGORY.NOT_FOUND);
    const categoryData = getInfoData({
      fields: ["id", "name"],
      object: foodCategoryExists,
    });
    const foodData = await FoodService.getAllByCategory(
      { page, limit, sortBy, orderBy, keyword },
      foodCategoryId
    );
    return {
      categoryData,
      foodData,
    };
  };

  static getAll = async () => {
    const { count, rows } = await FoodCategory.findAndCountAll({
      raw: true,
    });
    const list = rows.map((item) =>
      getInfoData({
        fields: ["id", "name"],
        object: item,
      })
    );
    return {
      total: count,
      list,
    };
  };

  static delete = async (foodCategoryId) => {
    const foodCategoryExists = await FoodCategory.findByPk(foodCategoryId);
    if (!foodCategoryExists)
      throw new NotFoundError(MESSAGES.FOOD_CATEGORY.NOT_FOUND);
    // xoa cac food co trong category
    const deletedFood = await FoodService.deleteFoodByCateFoodId(
      foodCategoryId
    );
    if (!deletedFood)
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.DELETE_FAILURE);
    const rowDeleted = await FoodCategory.destroy({
      where: {
        id: foodCategoryId,
      },
    });
    if (rowDeleted === 0)
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.DELETE_FAILURE);
    return MESSAGES.SUCCESS.DELETE;
  };
}

module.exports = FoodCategoryService;
