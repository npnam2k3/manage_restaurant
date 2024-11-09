const Joi = require("joi");
const customerSchema = Joi.object({
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
  phone_number: Joi.string()
    .pattern(/^(0|84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)
    .trim()
    .required()
    .messages({
      "string.empty": "Phone number is not allowed to be empty",
      "string.pattern.base":
        "Phone number must be a valid Vietnamese phone number",
      "any.required": "Phone number is required",
    }),
});

module.exports = customerSchema;
