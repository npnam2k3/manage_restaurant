"use strict";

const FoodCategoryService = require("../services/foodCategory.service");
const { Created, SuccessResponse } = require("../core/success.response");
const { MESSAGES, HTTP_STATUS_CODE } = require("../core/constant.response");
class FoodCategoryController {
  static create = async (req, res) => {
    const response = await FoodCategoryService.create(req.validatedData);
    new Created(
      MESSAGES.SUCCESS.CREATED,
      HTTP_STATUS_CODE.CREATED,
      response
    ).send(res);
  };

  static update = async (req, res) => {
    const foodCategoryId = parseInt(req.params.foodCategoryId);
    const response = await FoodCategoryService.update(
      foodCategoryId,
      req.validatedData
    );
    new SuccessResponse(response, HTTP_STATUS_CODE.OK).send(res);
  };

  static getById = async (req, res) => {
    const foodCategoryId = req.params.foodCategoryId;
    const response = await FoodCategoryService.getById(foodCategoryId);
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };

  static getAll = async (req, res) => {
    const response = await FoodCategoryService.getAll();
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };

  static delete = async (req, res) => {
    const foodCategoryId = parseInt(req.params.foodCategoryId);
    const response = await FoodCategoryService.delete(foodCategoryId);
    new SuccessResponse(response, HTTP_STATUS_CODE.OK).send(res);
  };
}

module.exports = FoodCategoryController;