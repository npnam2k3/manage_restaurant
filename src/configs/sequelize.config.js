const config = require("./config.mysql");

module.exports = {
  development: {
    username: config.db.username || "root",
    password: config.db.password,
    database: config.db.name || "manage_restaurant_db",
    host: config.db.host || "localhost",
    port: config.db.port || "3306",
    dialect: "mysql",
    // timezone: "+07:00", neu chay lenh migration thi dùng để xét timezone
  },
  // test: {
  //   username: process.env.TEST_DB_USERNAME || "root",
  //   password: process.env.TEST_DB_PASSWORD,
  //   database: process.env.TEST_DB_NAME || "database_test",
  //   host: process.env.TEST_DB_HOST || "localhost",
  //   dialect: "mysql",
  // },
  // production: {
  //   username: process.env.PROD_DB_USERNAME || "root",
  //   password: process.env.PROD_DB_PASSWORD,
  //   database: process.env.PROD_DB_NAME || "database_production",
  //   host: process.env.PROD_DB_HOST || "localhost",
  //   dialect: "mysql",
  // },
};
