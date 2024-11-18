const Joi = require("joi");

const resetPasswordSchema = Joi.object({
  passwordNew: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/
    )
    .max(30)
    .trim()
    .required()
    .messages({
      "string.empty": "Password is not allowed to be empty",
      "string.pattern.base":
        "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one number and one special character, and no spaces",
      "string.max": "Password cannot exceed {#limit} characters",
      "any.required": "Password is required",
    }),
});

module.exports = resetPasswordSchema;
