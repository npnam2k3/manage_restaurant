"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
const User = require("./user");

class Role extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Role.hasMany(User, {
      foreignKey: "role_id",
    });
    Role.belongsToMany(models.Permission, {
      through: "Role_Permissions",
      foreignKey: "role_id",
      otherKey: "permission_id",
    });
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
