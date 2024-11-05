"use strict";

const { HTTP_STATUS_CODE, MESSAGES } = require("./constant.response");

class SuccessResponse {
  constructor(message, statusCode = HTTP_STATUS_CODE.OK, metadata = {}) {
    this.message = message;
    this.status = statusCode;
    this.metadata = metadata;
  }
  send(res) {
    return res.status(this.status).json(this);
  }
}

class Created extends SuccessResponse {
  constructor(
    message = MESSAGES.SUCCESS.CREATED,
    statusCode = HTTP_STATUS_CODE.CREATED,
    metadata,
    options = {}
  ) {
    super(message, statusCode, metadata);
    this.options = options;
  }
}

class GetAll extends SuccessResponse {
  constructor(
    message = MESSAGES.SUCCESS.GET,
    statusCode = HTTP_STATUS_CODE.OK,
    metadata,
    options = {}
  ) {
    super(message, statusCode, metadata);
    this.options = options;
  }
}

module.exports = {
  Created,
  SuccessResponse,
  GetAll,
};
