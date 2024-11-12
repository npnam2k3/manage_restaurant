const Joi = require("joi");
const unitSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is not allowed to be empty",
    "any.required": "Name is required",
  }),
  description: Joi.string().trim().messages({
    "string.empty": "Description is not allowed to be empty",
  }),
});

module.exports = unitSchema;
