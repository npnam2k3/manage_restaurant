const Joi = require("joi");
const authSchema = Joi.object({
  email: Joi.string().trim().required().messages({
    "string.empty": "Email is not allowed to be empty",
    "any.required": " Email is required",
  }),
  password: Joi.string().trim().required().messages({
    "string.empty": "Password is not allowed to be empty",
    "any.required": " Password is required",
  }),
});

module.exports = authSchema;
