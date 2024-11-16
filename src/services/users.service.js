"use strict";
const User = require("../models/user");
const Role = require("../models/role");
const {
  MissingInputError,
  NotFoundError,
  OperationFailureError,
  ConflictRequestError,
} = require("../core/error.response");
const { MESSAGES, HTTP_STATUS_CODE } = require("../core/constant.response");
const { getInfoData } = require("../utils/index");
const bcrypt = require("bcrypt");
const { Op, where } = require("sequelize");
const ROLE = require("../core/constant.role");
const getDateTime = require("../utils/getDatetime");

class UserService {
  static saltRounds = 10;
  static createUser = async (data) => {
    // check email and username exists
    const userExists = await User.findOne({
      where: {
        // [Op.or]: {
        //   email: data.email,
        //   phone_number: data.phoneNumber,
        // },
        email: data.email,
      },
    });
    if (userExists) {
      const errorExists = {
        email: MESSAGES.USER.EMAIL_EXISTS,
      };
      if (userExists.phone_number === data.phoneNumber) {
        errorExists.phoneNumber = MESSAGES.USER.PHONE_NUMBER_EXISTS;
      }
      throw new ConflictRequestError(
        MESSAGES.USER.EXISTS,
        HTTP_STATUS_CODE.CONFLICT,
        errorExists
      );
    }

    // get role_id by roleName
    const role = await Role.findOne({
      where: { role_name: data.roleName },
      raw: true,
    });

    // hash password
    const passwordHash = await bcrypt.hash(data.password, this.saltRounds);
    const user = await User.create({
      username: data.username,
      email: data.email,
      password: passwordHash,
      full_name: data.full_name,
      address: data.address,
      phone_number: data.phoneNumber,
      position: data.position,
      role_id: role.id,
    });
    if (user) {
      return getInfoData({
        fields: ["id", "username", "email", "full_name"],
        object: user,
      });
    }
  };

  static updateUser = async (userId, dataUpdate) => {
    if (!userId) {
      throw new MissingInputError(MESSAGES.USER.MISSING_ID_USER);
    }

    // Kiểm tra user muốn update có tồn tại không
    const currentUser = await User.findByPk(userId);
    if (!currentUser) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    const updateDataClone = { ...dataUpdate };
    // console.log("clone data::", updateDataClone);
    if (updateDataClone.roleName) {
      // get role_id by roleName
      const role = await Role.findOne({
        where: { role_name: updateDataClone.roleName },
        raw: true,
      });

      // xóa thuộc tính roleName vì trong db không có trường này
      delete updateDataClone.roleName;

      // thêm trường role_id để cập nhật trong db
      updateDataClone.role_id = role.id;
    }
    const [numberRow] = await User.update(updateDataClone, {
      where: { id: userId },
    });
    // console.log("row::", numberRow);
    if (numberRow === 0) {
      throw new OperationFailureError(MESSAGES.OPERATION_FAILED.UPDATE_FAILURE);
    }
    // Lấy user sau khi update để trả về (nếu muốn trả về data)
    // const updatedUser = await User.findByPk(userId);
    // return getInfoData({
    //   fields: [
    //     "id",
    //     "username",
    //     "email",
    //     "full_name",
    //     "phone_number",
    //     "address",
    //   ],
    //   object: updatedUser,
    // });
    return MESSAGES.SUCCESS.UPDATE;
  };

  static getAllUser = async (
    { page, limit, orderBy, sortBy, keyword, status },
    roleId
  ) => {
    const queries = {
      offset: (page - 1) * limit,
      limit,
    };
    if (roleId) {
      // neu role la MANAGER thi khong duoc xem thong tin cua ADMIN
      const isManager = await Role.findOne({
        where: {
          role_name: ROLE.MANAGER,
        },
      });
      const isAdmin = await Role.findOne({
        where: { role_name: ROLE.ADMIN },
      });
      if (roleId === isManager.id) {
        queries.where = {
          role_id: { [Op.ne]: isAdmin.id },
        };
      }
    }
    if (sortBy) {
      queries.order = [[sortBy, orderBy]];
    }
    if (keyword) {
      queries.where = {
        ...queries.where,
        full_name: { [Op.substring]: keyword },
      };
    }
    if (status) {
      queries.where = {
        ...queries.where,
        status: { [Op.like]: status },
      };
    }
    // console.log("Check queries::", queries);
    const { count, rows } = await User.findAndCountAll({
      ...queries,
      include: [{ model: Role, attributes: ["role_name"] }],
      paranoid: false,
      raw: true,
      nest: true,
    });

    const listUser = rows.map((user) => {
      const data = getInfoData({
        fields: [
          "id",
          "username",
          "email",
          "full_name",
          "phone_number",
          "address",
          "position",
          "status",
        ],
        object: user,
      });
      data.createdAt = getDateTime(user.createdAt);
      data.roleName = user.Role.role_name;
      return data;
    });
    if (count > 0)
      return {
        total: count,
        page,
        limit,
        status,
        totalPage: Math.ceil(count / limit),
        listUser,
      };
    return {
      total: 0,
      page,
      limit,
      status,
      totalPages: 0,
      listUser: [],
    };
  };

  static getUserById = async (userId) => {
    const currentUser = await User.findByPk(userId, {
      include: [{ model: Role, attributes: ["role_name"] }],
      paranoid: false,
      raw: true,
      nest: true,
    });
    if (!currentUser) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    const data = getInfoData({
      fields: [
        "id",
        "username",
        "email",
        "full_name",
        "phone_number",
        "address",
        "position",
        "status",
      ],
      object: currentUser,
    });
    data.createdAt = getDateTime(currentUser.createdAt);
    data.roleName = currentUser.Role.role_name;
    return data;
  };

  static deleteUser = async (userId) => {
    const currentUser = await User.findByPk(userId);
    if (!currentUser) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    const [rowUpdated] = await User.update(
      { status: "blocked" },
      {
        where: {
          id: userId,
        },
      }
    );
    if (rowUpdated === 0) return MESSAGES.OPERATION_FAILED.DELETE_FAILURE;
    const rowDeleted = await User.destroy({
      where: {
        id: userId,
      },
    });
    if (rowDeleted === 0) {
      return MESSAGES.OPERATION_FAILED.DELETE_FAILURE;
    }
    return MESSAGES.SUCCESS.DELETE;
  };
}

module.exports = UserService;
