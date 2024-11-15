const Joi = require("joi");
const changePasswordSchema = Joi.object({
  passwordOld: Joi.string().trim().required().messages({
    "string.empty": "Old password is not allowed to be empty",
    "any.required": " Old password is required",
  }),
  passwordNew: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/
    )
    .max(30)
    .trim()
    .required()
    .messages({
      "string.empty": "New password is not allowed to be empty",
      "string.pattern.base":
        "New password must contain at least 6 characters, one uppercase letter, one lowercase letter, one number and one special character, and no spaces",
      "string.max": "New password cannot exceed {#limit} characters",
      "any.required": "New password is required",
    }),
});

module.exports = changePasswordSchema;
