const Joi = require("joi");

const userUpdateSchema = Joi.object({
  full_name: Joi.string()
    .pattern(/^[a-zA-ZÀ-ỹ\s]+$/)
    .trim()
    .messages({
      "string.empty": "Full name is not allowed to be empty",
      "string.pattern.base":
        "Full name must contain only letters and spaces, no special characters or numbers allowed",
      "any.required": "Full name is required",
    }),
  phone_number: Joi.string()
    .pattern(/^(0|84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)
    .trim()
    .messages({
      "string.empty": "Phone number is not allowed to be empty",
      "string.pattern.base":
        "Phone number must be a valid Vietnamese phone number",
      "any.required": "Phone number is required",
    }),
  address: Joi.string().trim().messages({
    "string.empty": "Address is not allowed to be empty",
    "any.required": "Address is required",
  }),
  position: Joi.string().trim().messages({
    "string.empty": "Position is not allowed to be empty",
    "any.required": "Position is required",
  }),
  roleName: Joi.string()
    .valid("ADMIN", "MANAGER", "CASHIER", "STAFF")
    .trim()
    .messages({
      "string.empty": "Role name is not allowed to be empty",
      "any.only": "Role name must be one of: ADMIN, MANAGER, CASHIER, STAFF",
      "any.required": "Role name is required",
    }),
});

module.exports = userUpdateSchema;
