"use strict";
const JWT = require("jsonwebtoken");

const createPairToken = (payload, accessTokenSecret, refreshTokenSecret) => {
  const accessToken = JWT.sign(payload, accessTokenSecret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = JWT.sign(payload, refreshTokenSecret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
};

module.exports = { createPairToken };
