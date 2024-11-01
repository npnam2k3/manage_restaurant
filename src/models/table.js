"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Table.belongsTo(models.Customer);
      Table.hasOne(models.Order);
    }
  }
  Table.init(
    {
      number: DataTypes.INTEGER,
      status: DataTypes.ENUM("available", "reserved", "occupied"),
      // reserved: da dat truoc
      // available: con trong
      // occupied: dang co khach ngoi
      customer_id: DataTypes.INTEGER,
      reservation_time: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Table",
    }
  );
  return Table;
};
