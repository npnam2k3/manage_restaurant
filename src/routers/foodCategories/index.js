"use strict";

import express from "express";
const FoodCategoryController = require("../../controllers/foodCategory.controller");
const { asyncHandle } = require("../../utils/handleError");
const validateMiddleware = require("../../middlewares/validate.middleware");
const foodCategorySchema = require("../../validations/foodCategorySchema");
const foodCategoryUpdateSchema = require("../../validations/foodCategoryUpdateSchema");
const checkPermissions = require("../../middlewares/check_permission.middleware");
const { PERMISSIONS } = require("../../core/constant.permission");
const {
  verifyAccessToken,
} = require("../../middlewares/verify_token.middleware");
const router = express.Router();

router.use(verifyAccessToken);
router.post(
  "/",
  checkPermissions(PERMISSIONS.MENU.CREATE),
  validateMiddleware(foodCategorySchema),
  asyncHandle(FoodCategoryController.create)
);

router.patch(
  "/:foodCategoryId",
  checkPermissions(PERMISSIONS.MENU.UPDATE),
  validateMiddleware(foodCategoryUpdateSchema),
  asyncHandle(FoodCategoryController.update)
);

router.get(
  "/getAll",
  checkPermissions(PERMISSIONS.MENU.READ),
  asyncHandle(FoodCategoryController.getAll)
);
router.get(
  "/:foodCategoryId",
  checkPermissions(PERMISSIONS.MENU.READ),
  asyncHandle(FoodCategoryController.getById)
);

router.delete(
  "/:foodCategoryId",
  checkPermissions(PERMISSIONS.MENU.DELETE),
  asyncHandle(FoodCategoryController.delete)
);

export default router;
