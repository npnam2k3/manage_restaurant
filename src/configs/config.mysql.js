"use strict";
require("dotenv").config();
const dev = {
  app: {
    port: process.env.DEV_APP_PORT,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || "3306",
    name: process.env.DEV_DB_NAME || "manage_restaurant_db",
    username: process.env.DEV_DB_USERNAME || "root",
    password: process.env.DEV_DB_PASSWORD,
    dialect: "mysql",
  },
};

const config = { dev };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
