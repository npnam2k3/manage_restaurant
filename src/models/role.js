"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");

class Role extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Role.hasMany(models.User);
    Role.belongsToMany(models.Permission, { through: "RolePermission" });
  }
}
Role.init(
  {
    role_name: DataTypes.STRING,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "Role",
  }
);

module.exports = Role;
