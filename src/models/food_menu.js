"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FoodMenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FoodMenu.belongsToMany(models.Order, { through: "OrderItem" });
      FoodMenu.belongsTo(models.FoodCategory);
      FoodMenu.belongsTo(models.Unit);
    }
  }
  FoodMenu.init(
    {
      name: DataTypes.STRING,
      image_url: DataTypes.STRING,
      price: DataTypes.BIGINT,
      category_id: DataTypes.INTEGER,
      unit_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "FoodMenu",
    }
  );
  return FoodMenu;
};
