"use strict";
const FoodCategory = require("../models/food_category");
const { MESSAGES, HTTP_STATUS_CODE } = require("../core/constant.response");
const {
  ConflictRequestError,
  OperationFailureError,
  NotFoundError,
  MissingInputError,
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
    if (dataUpdate.name === foodCategoryExists.name) {
      throw new MissingInputError(
        MESSAGES.ERROR.CONFLICT,
        HTTP_STATUS_CODE.CONFLICT,
        { name: MESSAGES.FOOD_CATEGORY.EXISTS }
      );
    }
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

  static getAll = async ({ page, limit }) => {
    const queries = {
      offset: (page - 1) * limit,
      limit,
    };
    const { count, rows } = await FoodCategory.findAndCountAll({
      ...queries,
      raw: true,
    });
    if (count > 0) {
      const list = rows.map((item) =>
        getInfoData({
          fields: ["id", "name"],
          object: item,
        })
      );
      return {
        total: list.length,
        page,
        limit,
        totalPage: Math.ceil(count / limit),
        list,
      };
    }
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      list: [],
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
