import express from "express";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import router from "./routers/index.js";
const { RESPONSE_TYPE } = require("./core/constant.response.js");
const { NotFoundError } = require("./core/error.response.js");

const app = express();
// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression()); // nen payload khi luong du lieu truyen qua lon
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
require("./dbs/init.mysqldb.js");
// init routes
app.use("/", router);

// handle error
// middleware
app.use((req, res, next) => {
  const error = new NotFoundError();
  next(error);
});

// handling error
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: RESPONSE_TYPE.ERROR,
    code: statusCode,
    message: err.message || "Internal Server Error",
  });
});

export default app;
