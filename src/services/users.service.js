"use strict";
const User = require("../models/user");
const Role = require("../models/role");
const {
  MissingInputError,
  NotFoundError,
  OperationFailureError,
  ConflictRequestError,
} = require("../core/error.response");
const { MESSAGES } = require("../core/constant.response");
const { getInfoData } = require("../utils/index");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

class UserService {
  static saltRounds = 10;
  static createUser = async (data) => {
    // check email and username exists
    const userExists = await User.findOne({
      where: {
        // [Op.or]: {
        //   email: data.email,
        //   username: data.username,
        // },
        email: data.email,
      },
    });
    if (userExists) {
      // console.log("check user exists::", userExists);
      throw new ConflictRequestError(MESSAGES.USER.EMAIL_EXISTS);
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
      full_name: data.fullName,
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

  static getAllUser = async ({ page, limit, orderBy, sortBy, keyword }) => {
    const queries = {
      offset: (page - 1) * limit,
      limit,
    };
    if (sortBy) {
      queries.order = [[sortBy, orderBy]];
    }
    if (keyword) {
      queries.where = {
        full_name: { [Op.substring]: keyword },
      };
    }
    console.log("Check queries::", queries);
    const { count, rows } = await User.findAndCountAll({
      ...queries,
      raw: true,
    });
    const listUser = rows.map((user) =>
      getInfoData({
        fields: [
          "id",
          "username",
          "email",
          "full_name",
          "phone_number",
          "address",
          "position",
        ],
        object: user,
      })
    );
    if (count > 0)
      return {
        total: listUser.length,
        page,
        limit,
        totalPage: Math.ceil(count / limit),
        listUser,
      };
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  };

  static getCurrentUser = async (userId) => {
    const currentUser = await User.findByPk(userId);
    if (!currentUser) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    return getInfoData({
      fields: [
        "id",
        "username",
        "email",
        "full_name",
        "phone_number",
        "address",
        "position",
      ],
      object: currentUser,
    });
  };

  static deleteUser = async (userId) => {
    const currentUser = await User.findByPk(userId);
    if (!currentUser) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
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
