"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserInfoShift extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserInfoShift.init(
    {
      shift_id: DataTypes.INTEGER,
      info_user_id: DataTypes.INTEGER,
      work_date: DataTypes.DATE,
      status: DataTypes.ENUM("work", "off"),
    },
    {
      sequelize,
      paranoid: true,
      modelName: "UserInfoShift",
    }
  );
  return UserInfoShift;
};
