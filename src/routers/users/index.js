"use strict";

import express from "express";
const UserController = require("../../controllers/users.controller");
const { asyncHandle } = require("../../utils/handleError");
const validateMiddleware = require("../../middlewares/validate.middleware");
const userSchema = require("../../validations/userSchema");
const userUpdateSchema = require("../../validations/userUpdateSchema");
const router = express.Router();

router.post(
  "/",
  validateMiddleware(userSchema),
  asyncHandle(UserController.createUser)
);
router.get("/getAllUsers", asyncHandle(UserController.getAllUser));
router.get(
  "/getCurrentUser/:userId",
  asyncHandle(UserController.getCurrentUser)
);
router.patch(
  "/:userId",
  validateMiddleware(userUpdateSchema),
  asyncHandle(UserController.updateUser)
);
router.delete("/:userId", asyncHandle(UserController.deleteUser));

export default router;
