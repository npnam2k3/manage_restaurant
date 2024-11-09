"use strict";

import express from "express";
const CustomerController = require("../../controllers/customer.controller");
const { asyncHandle } = require("../../utils/handleError");
const validateMiddleware = require("../../middlewares/validate.middleware");
const customerSchema = require("../../validations/customerSchema");
const customerUpdateSchema = require("../../validations/customerUpdateSchema ");
const checkPermissions = require("../../middlewares/check_permission.middleware");
const { PERMISSIONS } = require("../../core/constant.permission");
const {
  verifyAccessToken,
} = require("../../middlewares/verify_token.middleware");

const router = express.Router();

router.use(verifyAccessToken);
router.post(
  "/",
  checkPermissions(PERMISSIONS.CUSTOMER.CREATE),
  validateMiddleware(customerSchema),
  asyncHandle(CustomerController.createCustomer)
);
router.patch(
  "/:customerId",
  checkPermissions(PERMISSIONS.CUSTOMER.UPDATE),
  validateMiddleware(customerUpdateSchema),
  asyncHandle(CustomerController.updateCustomer)
);

router.get(
  "/getAllCustomers",
  checkPermissions(PERMISSIONS.CUSTOMER.READ),
  asyncHandle(CustomerController.getAllCustomers)
);
router.get(
  "/:customerId",
  checkPermissions(PERMISSIONS.CUSTOMER.READ),
  asyncHandle(CustomerController.getCustomerById)
);

router.delete(
  "/:customerId",
  checkPermissions(PERMISSIONS.CUSTOMER.DELETE),
  asyncHandle(CustomerController.deleteCustomer)
);
export default router;
