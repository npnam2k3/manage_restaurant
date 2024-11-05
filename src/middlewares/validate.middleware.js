const { validateHelper } = require("../helpers/validation");
const { MissingInputError } = require("../core/error.response");

const customError = (error) => {
  return error.details.map((err) => err.message);
};
const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const { error, value } = validateHelper(schema, req.body);

    if (error) {
      // console.log("error validate in middleware::", customError(error));

      throw new MissingInputError(customError(error));
    }
    // Gán data đã validate vào req
    req.validatedData = value;
    next();
  };
};

module.exports = validateMiddleware;
