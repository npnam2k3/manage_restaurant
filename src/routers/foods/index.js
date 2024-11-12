"use strict";

import express from "express";
const FoodController = require("../../controllers/food.controller");
const { asyncHandle } = require("../../utils/handleError");
const validateMiddleware = require("../../middlewares/validate.middleware");
const foodSchema = require("../../validations/foodSchema");
const foodUpdateSchema = require("../../validations/foodUpdateSchema");
const checkPermissions = require("../../middlewares/check_permission.middleware");
const { PERMISSIONS } = require("../../core/constant.permission");
const {
  verifyAccessToken,
} = require("../../middlewares/verify_token.middleware");
const router = express.Router();
const uploadCloud = require("../../middlewares/cloudinary");

router.use(verifyAccessToken);
router.post(
  "/",
  checkPermissions(PERMISSIONS.MENU.CREATE),
  uploadCloud.single("image_url"),
  validateMiddleware(foodSchema),
  asyncHandle(FoodController.createFood)
);
router.patch(
  "/:foodId",
  checkPermissions(PERMISSIONS.MENU.UPDATE),
  uploadCloud.single("image_url"),
  validateMiddleware(foodUpdateSchema),
  asyncHandle(FoodController.updateFood)
);
router.get(
  "/getAll",
  checkPermissions(PERMISSIONS.MENU.READ),
  asyncHandle(FoodController.getAllFoods)
);
router.get(
  "/:foodId",
  checkPermissions(PERMISSIONS.MENU.READ),
  asyncHandle(FoodController.getById)
);

router.delete(
  "/:foodId",
  checkPermissions(PERMISSIONS.MENU.DELETE),
  asyncHandle(FoodController.deleteFood)
);

export default router;
