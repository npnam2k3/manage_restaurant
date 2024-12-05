"use strict";

import express from "express";
const TableController = require("../../controllers/table.controller");
const { asyncHandle } = require("../../utils/handleError");
const validateMiddleware = require("../../middlewares/validate.middleware");
const tableSchema = require("../../validations/tableSchema");
const tableBookingSchema = require("../../validations/tableBookingSchema");
const orderFoodSchema = require("../../validations/orderFoodSchema");
const listIdTableSchema = require("../../validations/listIdTableSchema");
const listFoodTableSchema = require("../../validations/updateListFoodByTableSchema");
const cancelTableSchema = require("../../validations/cancelTableSchema");
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
router.get(
  "/",
  checkPermissions(PERMISSIONS.TABLE.READ),
  asyncHandle(TableController.getAll)
);

router.get(
  "/getById/:tableId",
  checkPermissions(PERMISSIONS.TABLE.READ),
  asyncHandle(TableController.getById)
);

router.patch(
  "/bookingTable",
  checkPermissions(PERMISSIONS.TABLE.UPDATE),
  validateMiddleware(tableBookingSchema),
  asyncHandle(TableController.bookingTable)
);

router.post(
  "/orderFoodByTable",
  checkPermissions(PERMISSIONS.TABLE.UPDATE),
  validateMiddleware(orderFoodSchema),
  asyncHandle(TableController.orderFoodByTable)
);

router.post(
  "/getListFoodByTable",
  checkPermissions(PERMISSIONS.TABLE.UPDATE),
  validateMiddleware(listIdTableSchema),
  asyncHandle(TableController.getListFoodByTable)
);
router.post(
  "/updateFoodTable",
  checkPermissions(PERMISSIONS.TABLE.UPDATE),
  validateMiddleware(listFoodTableSchema),
  asyncHandle(TableController.updateListFoodByTable)
);
router.post(
  "/cancelTable",
  checkPermissions(PERMISSIONS.TABLE.UPDATE),
  validateMiddleware(cancelTableSchema),
  asyncHandle(TableController.cancelTable)
);
router.post(
  "/customerReceiveTable",
  checkPermissions(PERMISSIONS.TABLE.UPDATE),
  validateMiddleware(cancelTableSchema),
  asyncHandle(TableController.customerReceiveTable)
);
router.get(
  "/findTableByStatus",
  checkPermissions(PERMISSIONS.TABLE.READ),
  asyncHandle(TableController.findTableByStatus)
);

export default router;
