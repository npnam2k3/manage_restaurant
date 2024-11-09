"use strict";
import express from "express";
import authRouter from "./auth/index.js";
import userRouter from "./users/index.js";
import customerRouter from "./customers/index.js";

const router = express.Router();
const API_V1 = "/api/v1";

router.use(`${API_V1}/auth`, authRouter);
router.use(`${API_V1}/users`, userRouter);
router.use(`${API_V1}/customers`, customerRouter);

export default router;
