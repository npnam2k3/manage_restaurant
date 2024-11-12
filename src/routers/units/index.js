"use strict";

import express from "express";
const UnitController = require("../../controllers/unit.controller");
const { asyncHandle } = require("../../utils/handleError");
const validateMiddleware = require("../../middlewares/validate.middleware");
const unitSchema = require("../../validations/unitSchema");
const unitUpdateSchema = require("../../validations/unitUpdateSchema");
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
  validateMiddleware(unitSchema),
  asyncHandle(UnitController.create)
);

router.patch(
  "/:unitId",
  checkPermissions(PERMISSIONS.MENU.UPDATE),
  validateMiddleware(unitUpdateSchema),
  asyncHandle(UnitController.update)
);

router.get(
  "/",
  checkPermissions(PERMISSIONS.MENU.READ),
  asyncHandle(UnitController.getAll)
);

router.get(
  "/:unitId",
  checkPermissions(PERMISSIONS.MENU.READ),
  asyncHandle(UnitController.getById)
);

export default router;
