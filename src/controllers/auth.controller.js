"use strict";
const AuthService = require("../services/auth.service");
const { Login, SuccessResponse } = require("../core/success.response");
const { HTTP_STATUS_CODE, MESSAGES } = require("../core/constant.response");

class AuthController {
  static login = async (req, res, next) => {
    const response = await AuthService.login(req.validatedData, res);
    new Login(MESSAGES.AUTH.LOGIN_SUCCESS, HTTP_STATUS_CODE.OK, response).send(
      res
    );
  };

  static refreshToken = async (req, res, next) => {
    const response = await AuthService.refreshToken(req, res);
    new Login(MESSAGES.AUTH.LOGIN_SUCCESS, HTTP_STATUS_CODE.OK, response).send(
      res
    );
  };

  static getInfo = async (req, res, next) => {
    const response = await AuthService.getInfo(req);
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };

  static logout = async (req, res, next) => {
    const response = await AuthService.logout(req, res);
    new SuccessResponse(response, HTTP_STATUS_CODE.OK).send(res);
  };
}

module.exports = AuthController;
