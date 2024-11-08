"use strict";
const User = require("../models/user");
const {
  NotFoundError,
  AuthFailureError,
  OperationFailureError,
} = require("../core/error.response");
const { MESSAGES } = require("../core/constant.response");
const bcrypt = require("bcrypt");
const { createPairToken } = require("../utils/authUtils");
const { getInfoData } = require("../utils/index");
const { where } = require("sequelize");
const verifyRefreshToken = require("../helpers/verify_refreshToken");
const { raw } = require("mysql2");

class AuthService {
  static COOKIE_MAX_AGE = 10 * 24 * 60 * 60 * 1000; // 10 days
  static COOKIE_NAME = "refreshToken";
  static COOKIE_CONFIG = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: this.COOKIE_MAX_AGE,
  };
  static login = async ({ email, password }, res) => {
    const userLogin = await User.findOne({
      where: { email },
      raw: true,
    });
    // console.log("check userLogin::", userLogin);
    if (!userLogin) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    const matchPassword = await bcrypt.compare(password, userLogin.password);
    if (!matchPassword) {
      throw new AuthFailureError(MESSAGES.AUTH.INCORRECT_PASSWORD);
    }

    const payload = {
      userId: userLogin.id,
      email,
      role_id: userLogin.role_id,
    };
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const { accessToken, refreshToken } = createPairToken(
      payload,
      accessTokenSecret,
      refreshTokenSecret
    );
    // lưu refresh token vào database
    const [rowUpdated] = await User.update(
      {
        refresh_token: refreshToken,
      },
      {
        where: {
          id: userLogin.id,
        },
      }
    );

    if (rowUpdated === 0) {
      throw new OperationFailureError(MESSAGES.AUTH.LOGIN_FAILED);
    }

    // set refresh token cookie
    res.cookie(this.COOKIE_NAME, refreshToken, this.COOKIE_CONFIG);
    return {
      userInfo: getInfoData({
        fields: ["id", "email", "username", "full_name"],
        object: userLogin,
      }),
      accessToken,
    };
  };

  static refreshToken = async (req, res) => {
    const refresh_token = req.cookies.refreshToken;
    if (!refresh_token) {
      throw new AuthFailureError(MESSAGES.AUTH.REFRESH_TOKEN_REQUIRED);
    }
    // console.log("check refresh token in service::", refresh_token);
    const decode = verifyRefreshToken(refresh_token);
    // console.log("check decode RT in service::", decode);
    const user = await User.findOne({
      where: {
        id: decode.userId,
        refresh_token,
      },
      raw: true,
    });
    // console.log("check user service::", user);
    if (!user) {
      throw new AuthFailureError(MESSAGES.USER.NOT_FOUND);
    }
    const payload = {
      userId: user.id,
      role_id: user.role_id,
      email: user.email,
    };
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    // tạo cặp token mới
    const { accessToken, refreshToken } = createPairToken(
      payload,
      accessTokenSecret,
      refreshTokenSecret
    );
    // console.log("New RT::", refreshToken);
    const [rowUpdated] = await User.update(
      {
        refresh_token: refreshToken,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    // console.log("check rowUpdated::", rowUpdated);
    if (rowUpdated === 0) {
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.UPDATE_FAILURE);
    }
    // set refresh token cookie
    res.cookie(this.COOKIE_NAME, refreshToken, this.COOKIE_CONFIG);
    return {
      userInfo: getInfoData({
        fields: ["id", "email", "username", "full_name"],
        object: user,
      }),
      accessToken,
    };
  };

  static getInfo = async (req) => {
    const { userId } = req?.user;
    // console.log("check id user::", userId);
    const infoUser = await User.findByPk(userId, { raw: true });
    // console.log("check user info::", infoUser);
    if (!infoUser) {
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.COMMON);
    }
    return getInfoData({
      fields: [
        "id",
        "email",
        "username",
        "full_name",
        "phone_number",
        "address",
        "position",
      ],
      object: infoUser,
    });
  };

  static logout = async (req, res) => {
    const { userId } = req?.user;
    const [rowUpdated] = await User.update(
      { refresh_token: null },
      { where: { id: userId } }
    );
    if (rowUpdated === 0) {
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.UPDATE_FAILURE);
    }
    // delete cookie
    res.clearCookie(this.COOKIE_NAME, {
      ...this.COOKIE_CONFIG,
      maxAge: 0,
    });
    return MESSAGES.AUTH.LOGOUT_SUCCESS;
  };
}

module.exports = AuthService;
