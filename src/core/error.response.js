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
    status = HTTP_STATUS_CODE.CONFLICT,
    details = {}
  ) {
    super(message, status);
    this.details = details;
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
    status = HTTP_STATUS_CODE.NOT_FOUND,
    details = {}
  ) {
    super(message, status);
    this.details = details;
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = MESSAGES.AUTH.UNAUTHENTICATED,
    status = HTTP_STATUS_CODE.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

class MissingInputError extends ErrorResponse {
  constructor(
    message = MESSAGES.ERROR.INVALID_INPUT,
    status = HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
    details = {}
  ) {
    super(message, status);
    this.details = details;
  }
}

class OperationFailureError extends ErrorResponse {
  constructor(
    message = MESSAGES.OPERATION_FAILED.COMMON,
    status = HTTP_STATUS_CODE.BAD_REQUEST
  ) {
    super(message, status);
  }
}

class ServerError extends ErrorResponse {
  constructor(
    message = MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
    status = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
  ) {
    super(message, status);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = MESSAGES.ERROR.FORBIDDEN,
    status = HTTP_STATUS_CODE.FORBIDDEN
  ) {
    super(message, status);
  }
}

class DiscountInvalid extends ErrorResponse {
  constructor(
    message = MESSAGES.DISCOUNT.INVALID,
    status = HTTP_STATUS_CODE.BAD_REQUEST,
    details = {}
  ) {
    super(message, status);
    this.details = details;
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  NotFoundError,
  AuthFailureError,
  MissingInputError,
  OperationFailureError,
  ServerError,
  ForbiddenError,
  DiscountInvalid,
};
