"use strict";

import express from "express";
const TableController = require("../../controllers/table.controller");
const { asyncHandle } = require("../../utils/handleError");
const validateMiddleware = require("../../middlewares/validate.middleware");
const tableSchema = require("../../validations/tableSchema");
const tableUpdateSchema = require("../../validations/tableUpdateSchema");
const checkPermissions = require("../../middlewares/check_permission.middleware");
const { PERMISSIONS } = require("../../core/constant.permission");
const {
  verifyAccessToken,
} = require("../../middlewares/verify_token.middleware");
const router = express.Router();

router.use(verifyAccessToken);
router.post(
  "/",
  checkPermissions(PERMISSIONS.TABLE.CREATE),
  validateMiddleware(tableSchema),
  asyncHandle(TableController.createTable)
);

export default router;
