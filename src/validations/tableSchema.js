const Joi = require("joi");
const tableSchema = Joi.object({
  number: Joi.string().trim().required().messages({
    "string.empty": "Table number is not allowed to be empty",
    "any.required": "Table number is required",
  }),
});

module.exports = tableSchema;
