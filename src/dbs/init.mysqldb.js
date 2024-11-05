"use strict";
const { Sequelize } = require("sequelize");
const configMysql = require("../configs/config.mysql");

const db = configMysql.db;

class Database {
  static instance = null;
  static connection = null;
  constructor() {
    this.connect();
  }

  connect() {
    if (!this.connection) {
      this.connection = new Sequelize(db.name, db.username, db.password, {
        host: db.host,
        dialect: db.dialect,
        timezone: "+07:00",
        logging: process.env.NODE_ENV !== "production" ? console.log : false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });
      // Kiểm tra kết nối sau khi tạo instance
      this.connection
        .authenticate()
        .then(() => {
          console.log("Connection to MySQL has been established successfully.");
        })
        .catch((error) => {
          console.error("Unable to connect to MySQL database:", error);
        });
    }
    return this.connection;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance.connection;
  }
}

const instanceMySQL = Database.getInstance();
module.exports = instanceMySQL;
