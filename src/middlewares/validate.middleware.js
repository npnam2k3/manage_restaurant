const { validateHelper } = require("../helpers/validation");
const { MissingInputError } = require("../core/error.response");
const deleteFileCloudinary = require("../utils/deleteFileCloudinary");

const customError = (error) => {
  return error.details.map((err) => err.message);
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
      throw new MissingInputError(customError(error));
    }
    // Gán data đã validate vào req
    req.validatedData = value;
    next();
  };
};

module.exports = validateMiddleware;
