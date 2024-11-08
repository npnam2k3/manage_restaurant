"use strict";
const Role = require("../models/role");
const Permission = require("../models/permission");
const { MESSAGES } = require("../core/constant.response");
const { ForbiddenError } = require("../core/error.response");

// Thiết lập associations trước khi sử dụng
Role.associate({ Permission });
Permission.associate({ Role });

const checkPermissions = (requiredPermissions) => {
  return async (req, res, next) => {
    const roleId = req.user.role_id;
    console.log("check role id from middleware check permission::", roleId);
    const permissions = await Role.findByPk(roleId, {
      include: [
        {
          model: Permission,
          through: {
            attributes: [],
          },
          attributes: ["permission_name"],
        },
      ],
    });

    const permissionNames = permissions.Permissions.map(
      (p) => p.permission_name
    );
    console.log("Permission names:", permissionNames);
    const isAdmin = permissionNames.some((per) => per === "*");
    if (isAdmin) {
      return next();
    }
    const hasPermission = permissionNames.some(
      (per) => per === requiredPermissions
    );
    if (!hasPermission) {
      return next(new ForbiddenError(MESSAGES.PERMISSION.DENIED));
    }
    return next();
  };
};

module.exports = checkPermissions;
