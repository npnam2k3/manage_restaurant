const { validateHelper } = require("../helpers/validation");
const { MissingInputError } = require("../core/error.response");
const deleteFileCloudinary = require("../utils/deleteFileCloudinary");
const { HTTP_STATUS_CODE, MESSAGES } = require("../core/constant.response");

const customError = (error) => {
  const errorObj = {};
  error.details.forEach((err) => {
    errorObj[err.path[0]] = err.message;
  });
  return errorObj;
};
const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const { error, value } = validateHelper(schema, req.body);
    if (error) {
      // console.log("error validate in middleware::", customError(error));
      if (req.file) {
        // console.log("co file nhung validate fail xoa file");
        deleteFileCloudinary(req.file.filename);
      }
      throw new MissingInputError(
        MESSAGES.ERROR.VALIDATION_DATA,
        HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
        customError(error)
      );
    }
    // Gán data đã validate vào req
    req.validatedData = value;
    next();
  };
};

module.exports = validateMiddleware;
