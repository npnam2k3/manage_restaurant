// src/models/index.js
const FoodCategory = require("./food_category");
const FoodMenu = require("./food_menu");
const Unit = require("./unit");
const Role = require("./role");
const Permission = require("./permission");
const User = require("../models/user");
const Table = require("../models/table");
const Customer = require("../models/customer");
const Order = require("../models/order");
const Discount = require("../models/discount");
const OrderItem = require("../models/order_item");

// Tạo một đối tượng chứa tất cả các mô hình
const models = {
  FoodCategory,
  FoodMenu,
  Unit,
  Role,
  Permission,
  User,
  Table,
  Customer,
  Order,
  Discount,
  OrderItem,
};

// Gọi phương thức associate cho từng mô hình nếu nó tồn tại
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Xuất các mô hình
module.exports = models;
