"use strict";

const { HTTP_STATUS_CODE, MESSAGES } = require("./constant.response");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = MESSAGES.ERROR.CONFLICT,
    status = HTTP_STATUS_CODE.CONFLICT
  ) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = MESSAGES.ERROR.BAD_REQUEST,
    status = HTTP_STATUS_CODE.BAD_REQUEST
  ) {
    super(message, status);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = MESSAGES.ERROR.NOT_FOUND,
    status = HTTP_STATUS_CODE.NOT_FOUND
  ) {
    super(message, status);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = MESSAGES.AUTH.UNAUTHORIZED,
    status = HTTP_STATUS_CODE.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  NotFoundError,
  AuthFailureError,
};
