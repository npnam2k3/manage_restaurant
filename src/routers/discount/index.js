"use strict";

import express from "express";
const DiscountController = require("../../controllers/discount.controller");
const { asyncHandle } = require("../../utils/handleError");
const validateMiddleware = require("../../middlewares/validate.middleware");
const discountSchema = require("../../validations/discountSchema");
const discountUpdateSchema = require("../../validations/discountUpdateSchema");
const checkPermissions = require("../../middlewares/check_permission.middleware");
const { PERMISSIONS } = require("../../core/constant.permission");
const {
  verifyAccessToken,
} = require("../../middlewares/verify_token.middleware");
const router = express.Router();

router.use(verifyAccessToken);
router.post(
  "/",
  checkPermissions(PERMISSIONS.DISCOUNT.CREATE),
  validateMiddleware(discountSchema),
  asyncHandle(DiscountController.createDiscount)
);
router.patch(
  "/:discountId",
  checkPermissions(PERMISSIONS.DISCOUNT.UPDATE),
  validateMiddleware(discountUpdateSchema),
  asyncHandle(DiscountController.updateDiscount)
);
router.get(
  "/",
  checkPermissions(PERMISSIONS.DISCOUNT.READ),
  asyncHandle(DiscountController.getAll)
);
router.get(
  "/:discountId",
  checkPermissions(PERMISSIONS.DISCOUNT.READ),
  asyncHandle(DiscountController.getById)
);

export default router;
