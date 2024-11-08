"use strict";
const { AuthFailureError } = require("../core/error.response");
const { MESSAGES } = require("../core/constant.response");
const JWT = require("jsonwebtoken");

const verifyAccessToken = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    // console.log("check bearer token::", bearerToken);
    if (!bearerToken) {
      return next(new AuthFailureError(MESSAGES.AUTH.UNAUTHENTICATED));
    }

    const accessToken = bearerToken?.split(" ")[1];
    const decode = JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    // console.log("check decode access token::", decode);
    req.user = decode;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AuthFailureError(MESSAGES.AUTH.TOKEN_EXPIRED));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new AuthFailureError(MESSAGES.AUTH.INVALID_TOKEN));
    }
    return next(error.message);
  }
};

module.exports = {
  verifyAccessToken,
};
