const JWT = require("jsonwebtoken");
const { MESSAGES } = require("../core/constant.response");
const { AuthFailureError } = require("../core/error.response");

const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AuthFailureError(MESSAGES.AUTH.REFRESH_TOKEN_EXPIRED);
    }
    if (error.name === "JsonWebTokenError") {
      throw new AuthFailureError(MESSAGES.AUTH.INVALID_REFRESH_TOKEN);
    }
    throw error;
  }
};

module.exports = verifyRefreshToken;
