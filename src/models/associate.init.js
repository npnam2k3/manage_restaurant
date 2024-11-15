// src/models/index.js
const FoodCategory = require("./food_category");
const FoodMenu = require("./food_menu");
const Unit = require("./unit");
const Role = require("./role");
const Permission = require("./permission");
const User = require("../models/user");

// Tạo một đối tượng chứa tất cả các mô hình
const models = {
  FoodCategory,
  FoodMenu,
  Unit,
  Role,
  Permission,
  User,
};

// Gọi phương thức associate cho từng mô hình nếu nó tồn tại
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Xuất các mô hình
module.exports = models;
