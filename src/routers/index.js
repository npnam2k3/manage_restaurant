"use strict";
import express from "express";
import authRouter from "./auth/index.js";
import userRouter from "./users/index.js";
import customerRouter from "./customers/index.js";
import tableRouter from "./table/index.js";
import foodRouter from "./foods/index.js";
import unitRouter from "./units/index.js";
import foodCategoriesRouter from "./foodCategories/index.js";
import discountRouter from "./discount/index.js";

const router = express.Router();
const API_V1 = "/api/v1";

router.use(`${API_V1}/auth`, authRouter);
router.use(`${API_V1}/users`, userRouter);
router.use(`${API_V1}/customers`, customerRouter);
router.use(`${API_V1}/tables`, tableRouter);
router.use(`${API_V1}/foods`, foodRouter);
router.use(`${API_V1}/units`, unitRouter);
router.use(`${API_V1}/foodCategories`, foodCategoriesRouter);
router.use(`${API_V1}/discounts`, discountRouter);

export default router;
