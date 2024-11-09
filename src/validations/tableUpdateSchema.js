const Joi = require("joi");
const tableSchema = Joi.object({
  number: Joi.string().trim().messages({
    "string.empty": "Table number is not allowed to be empty",
  }),
});

module.exports = tableSchema;
