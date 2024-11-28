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
const crypto = require("crypto");
const sendMail = require("../helpers/sendMail");

class UserService {
  static saltRounds = 10;
  static EXPIRATION_TIME = 60 * 15 * 1000;
  static createUser = async (data) => {
    // check email and username exists
    const userExists = await User.findOne({
      where: {
        [Op.or]: {
          email: data.email,
          phone_number: data.phone_number,
        },
      },
    });
    if (userExists) {
      let errorExists = {};
      if (userExists.email === data.email) {
        errorExists.email = MESSAGES.USER.EMAIL_EXISTS;
      }
      if (userExists.phone_number === data.phone_number) {
        errorExists.phone_number = MESSAGES.USER.PHONE_NUMBER_EXISTS;
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
      phone_number: data.phone_number,
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
    if (updateDataClone.phone_number) {
      const phoneExists = await User.count({
        where: {
          phone_number: updateDataClone.phone_number,
          id: {
            [Op.ne]: userId,
          },
        },
      });
      if (phoneExists > 0) {
        const error = {
          phone_number: MESSAGES.USER.PHONE_NUMBER_EXISTS,
        };
        throw new ConflictRequestError(
          MESSAGES.ERROR.CONFLICT,
          HTTP_STATUS_CODE.CONFLICT,
          error
        );
      }
    }
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

  static forgotPassword = async ({ email }) => {
    const userExists = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!userExists) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    const tokenReset = crypto.randomBytes(32).toString("hex");
    userExists.token_reset_password = tokenReset;
    userExists.token_reset_password_expiration =
      Date.now() + this.EXPIRATION_TIME;
    await userExists.save();

    const urlClient = process.env.CLIENT_URL;
    const resetLink = `${urlClient}/resetPassword/${tokenReset}`;
    const html = `Vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${resetLink}>Click here</a>`;

    try {
      await sendMail({ email, html });
      return MESSAGES.SUCCESS.SEND_MAIL;
    } catch (error) {
      throw new OperationFailureError(MESSAGES.ERROR.SEND_MAIL);
    }
  };

  static resetPassword = async (token, passwordNew) => {
    if (!token) throw new MissingInputError(MESSAGES.USER.RESET_TOKEN);
    const userExists = await User.findOne({
      where: {
        token_reset_password: token,
        token_reset_password_expiration: {
          [Op.gt]: Date.now(),
        },
      },
    });
    if (!userExists) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    const passwordHash = await bcrypt.hash(passwordNew, this.saltRounds);
    userExists.password = passwordHash;
    userExists.token_reset_password = null;
    userExists.token_reset_password_expiration = null;
    await userExists.save();

    return MESSAGES.USER.RESET_PASSWORD_SUCCESS;
  };
}

module.exports = UserService;
