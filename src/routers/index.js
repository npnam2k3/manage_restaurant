import express from "express";
import accessRouter from "./access/index.js";

const router = express.Router();
const API_V1 = "/api/v1";

router.use(`${API_V1}/access`, accessRouter);

export default router;
