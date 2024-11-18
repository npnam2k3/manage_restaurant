const Joi = require("joi");

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .pattern(
      /^[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/
    )
    .trim()
    .required()
    .messages({
      "string.empty": "Email is not allowed to be empty",
      "string.pattern.base": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
});

module.exports = forgotPasswordSchema;
