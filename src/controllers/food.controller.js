"use strict";

const FoodService = require("../services/food.service");
const { Created, SuccessResponse } = require("../core/success.response");
const { MESSAGES, HTTP_STATUS_CODE } = require("../core/constant.response");

class FoodController {
  static createFood = async (req, res) => {
    const data = {
      ...req.validatedData,
    };
    if (req.file) {
      data.fileImage = req.file;
    }

    const response = await FoodService.createFood(data);
    new Created(
      MESSAGES.SUCCESS.CREATED,
      HTTP_STATUS_CODE.CREATED,
      response
    ).send(res);
  };
  static updateFood = async (req, res) => {
    const foodId = req.params.foodId;
    const response = await FoodService.updateFood(
      foodId,
      req.validatedData,
      req.file
    );
    new SuccessResponse(response, HTTP_STATUS_CODE.OK).send(res);
  };

  static getById = async (req, res) => {
    const foodId = req.params.foodId;
    const response = await FoodService.getById(foodId);
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };

  static getAllFoods = async (req, res) => {
    const { page, limit, sortBy, orderBy, keyword } = req.query;
    const listFoods = await FoodService.getAllFoods({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || +process.env.LIMIT_RECORD_FOOD,
      sortBy,
      orderBy: orderBy?.toUpperCase() === "DESC" ? "DESC" : "ASC",
      keyword,
    });
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      listFoods
    ).send(res);
  };

  static deleteFood = async (req, res) => {
    const foodId = parseInt(req.params.foodId);
    const response = await FoodService.deleteFood(foodId);
    new SuccessResponse(response, HTTP_STATUS_CODE.OK).send(res);
  };
}

module.exports = FoodController;
