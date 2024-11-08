"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
class Permission extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Permission.belongsToMany(models.Role, {
      through: "Role_Permissions",
      foreignKey: "permission_id",
      otherKey: "role_id",
    });
  }
}
Permission.init(
  {
    permission_name: DataTypes.STRING,
    description: DataTypes.STRING,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "Permission",
  }
);
module.exports = Permission;
