"use strict";

import express from "express";
const OrderController = require("../../controllers/order.controller");
const { asyncHandle } = require("../../utils/handleError");
const validateMiddleware = require("../../middlewares/validate.middleware");

const listIdTableSchema = require("../../validations/listIdTableSchema");

const checkPermissions = require("../../middlewares/check_permission.middleware");
const { PERMISSIONS } = require("../../core/constant.permission");
const {
  verifyAccessToken,
} = require("../../middlewares/verify_token.middleware");
const router = express.Router();

router.use(verifyAccessToken);
router.post(
  "/",
  checkPermissions(PERMISSIONS.ORDER.CREATE),
  validateMiddleware(listIdTableSchema),
  asyncHandle(OrderController.createOrder)
);

export default router;
