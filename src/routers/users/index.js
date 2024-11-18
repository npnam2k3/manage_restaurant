"use strict";

import express from "express";
const UserController = require("../../controllers/users.controller");
const { asyncHandle } = require("../../utils/handleError");
const validateMiddleware = require("../../middlewares/validate.middleware");
const userSchema = require("../../validations/userSchema");
const userUpdateSchema = require("../../validations/userUpdateSchema");
const forgotPasswordSchema = require("../../validations/forgotPasswordSchema");
const resetPasswordSchema = require("../../validations/resetPasswordSchema");
const checkPermissions = require("../../middlewares/check_permission.middleware");
const { PERMISSIONS } = require("../../core/constant.permission");
const {
  verifyAccessToken,
} = require("../../middlewares/verify_token.middleware");
const router = express.Router();

router.post(
  "/forgotPassword",
  validateMiddleware(forgotPasswordSchema),
  asyncHandle(UserController.forgotPassword)
);
router.put(
  "/resetPassword/:token",
  validateMiddleware(resetPasswordSchema),
  asyncHandle(UserController.resetPassword)
);

router.use(verifyAccessToken);
router.post(
  "/",
  checkPermissions(PERMISSIONS.USER.CREATE),
  validateMiddleware(userSchema),
  asyncHandle(UserController.createUser)
);
router.get(
  "/getAllUsers",
  checkPermissions(PERMISSIONS.USER.READ_ALL),
  asyncHandle(UserController.getAllUser)
);
router.get(
  "/getUserById/:userId",
  checkPermissions(PERMISSIONS.USER.READ),
  asyncHandle(UserController.getUserById)
);
router.patch(
  "/:userId",
  checkPermissions(PERMISSIONS.USER.UPDATE),
  validateMiddleware(userUpdateSchema),
  asyncHandle(UserController.updateUser)
);
router.delete(
  "/:userId",
  checkPermissions(PERMISSIONS.USER.DELETE),
  asyncHandle(UserController.deleteUser)
);

export default router;
