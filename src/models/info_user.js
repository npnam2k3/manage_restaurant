"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InfoUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      InfoUser.hasOne(models.User);
      InfoUser.belongsToMany(models.Shift, { through: "UserInfoShift" });
    }
  }
  InfoUser.init(
    {
      full_name: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      address: DataTypes.STRING,
      position: DataTypes.STRING,
      hire_date: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "InfoUser",
    }
  );
  return InfoUser;
};
