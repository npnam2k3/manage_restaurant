const Joi = require("joi");
const userSchema = Joi.object({
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
  username: Joi.string().alphanum().min(5).max(20).trim().required().messages({
    "string.empty": "Username is not allowed to be empty",
    "string.min": "Username must be at least {#limit} characters long",
    "string.max": "Username cannot exceed {#limit} characters",
    "string.alphanum": "Username must only contain alpha-numeric characters",
    "any.required": "Username is required",
  }),
  password: Joi.string()
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
  full_name: Joi.string()
    .pattern(/^[a-zA-ZÀ-ỹ\s]+$/)
    .trim()
    .required()
    .messages({
      "string.empty": "Full name is not allowed to be empty",
      "string.pattern.base":
        "Full name must contain only letters and spaces, no special characters or numbers allowed",
      "any.required": "Full name is required",
    }),
  phoneNumber: Joi.string()
    .pattern(/^(0|84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)
    .trim()
    .required()
    .messages({
      "string.empty": "Phone number is not allowed to be empty",
      "string.pattern.base":
        "Phone number must be a valid Vietnamese phone number",
      "any.required": "Phone number is required",
    }),
  address: Joi.string().trim().required().messages({
    "string.empty": "Address is not allowed to be empty",
    "any.required": "Address is required",
  }),
  position: Joi.string().trim().required().messages({
    "string.empty": "Position is not allowed to be empty",
    "any.required": "Position is required",
  }),
  roleName: Joi.string()
    .valid("ADMIN", "MANAGER", "CASHIER", "STAFF")
    .trim()
    .required()
    .messages({
      "string.empty": "Role name is not allowed to be empty",
      "any.only": "Role name must be one of: ADMIN, MANAGER, CASHIER, STAFF",
      "any.required": "Role name is required",
    }),
});

module.exports = userSchema;
