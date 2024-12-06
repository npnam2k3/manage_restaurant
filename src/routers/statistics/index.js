"use strict";

import express from "express";
const StatisticController = require("../../controllers/statistic.controller");
const { asyncHandle } = require("../../utils/handleError");
const validateMiddleware = require("../../middlewares/validate.middleware");
const revenueDateSchema = require("../../validations/revenueDateSchema");

const checkPermissions = require("../../middlewares/check_permission.middleware");
const { PERMISSIONS } = require("../../core/constant.permission");
const {
  verifyAccessToken,
} = require("../../middlewares/verify_token.middleware");
const router = express.Router();

router.use(verifyAccessToken);
router.post(
  "/getRevenueByTimeRange",
  checkPermissions(PERMISSIONS.REVENUE),
  validateMiddleware(revenueDateSchema),
  asyncHandle(StatisticController.getRevenueByTimeRange)
);
router.get(
  "/getRevenueCommon",
  checkPermissions(PERMISSIONS.REVENUE),
  asyncHandle(StatisticController.getRevenueCommon)
);
router.get(
  "/statisticFoodBestSeller",
  checkPermissions(PERMISSIONS.REVENUE),
  asyncHandle(StatisticController.statisticFoodBestSeller)
);
export default router;
