import express from "express";
const AuthController = require("../../controllers/auth.controller");
const validateMiddleware = require("../../middlewares/validate.middleware");
const authSchema = require("../../validations/authSchema");
const changePasswordSchema = require("../../validations/changePasswordSchema");
const { asyncHandle } = require("../../utils/handleError");
const {
  verifyAccessToken,
} = require("../../middlewares/verify_token.middleware");

const router = express.Router();

router.post(
  "/login",
  validateMiddleware(authSchema),
  asyncHandle(AuthController.login)
);

router.post("/refreshToken", asyncHandle(AuthController.refreshToken));
router.get("/info", verifyAccessToken, asyncHandle(AuthController.getInfo));
router.post("/logout", verifyAccessToken, asyncHandle(AuthController.logout));
router.post(
  "/changePassword",
  verifyAccessToken,
  validateMiddleware(changePasswordSchema),
  asyncHandle(AuthController.changePassword)
);

export default router;
