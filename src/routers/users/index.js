"use strict";

import express from "express";
const { Created } = require("../../core/success.response");
const { HTTP_STATUS_CODE, MESSAGES } = require("../../core/constant.response");

const router = express.Router();

router.post("/create-user", (req, res, next) => {
  return new Created().send(res);
});

export default router;
