"use strict";
const UserService = require("../services/users.service");
const { Created, SuccessResponse } = require("../core/success.response");
const { HTTP_STATUS_CODE, MESSAGES } = require("../core/constant.response");

class UserController {
  static createUser = async (req, res, next) => {
    // console.log("data after validate:::", req.validatedData);

    new Created(
      MESSAGES.SUCCESS.CREATED,
      HTTP_STATUS_CODE.CREATED,
      await UserService.createUser(req.validatedData)
    ).send(res);
  };

  static updateUser = async (req, res, next) => {
    let userId = parseInt(req.params.userId);
    const userUpdated = await UserService.updateUser(userId, req.validatedData);
    new SuccessResponse(userUpdated, HTTP_STATUS_CODE.OK).send(res);
  };

  static getAllUser = async (req, res, next) => {
    const { page, limit, sortBy, orderBy, keyword, status } = req.query;
    const roleId = req.user.role_id;
    // console.log("check role id get ALL::", roleId);
    const listUser = await UserService.getAllUser(
      {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || +process.env.LIMIT_RECORD_USER,
        sortBy,
        orderBy: orderBy?.toUpperCase() === "DESC" ? "DESC" : "ASC",
        keyword,
        status: status?.toLowerCase(),
      },
      roleId
    );
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      listUser
    ).send(res);
  };

  static getUserById = async (req, res, next) => {
    const userId = req.params.userId;
    const currentUser = await UserService.getUserById(userId);
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      currentUser
    ).send(res);
  };

  static deleteUser = async (req, res, next) => {
    const userId = req.params.userId;
    new SuccessResponse(
      await UserService.deleteUser(userId),
      HTTP_STATUS_CODE.OK
    ).send(res);
  };
}

module.exports = UserController;
