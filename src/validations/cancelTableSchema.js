const Joi = require("joi");
const cancelTableSchema = Joi.object({
  listTableCustomerId: Joi.array()
    .min(1)
    .items(
      Joi.object({
        id: Joi.number().integer().min(0).required().messages({
          "number.base": "Table customer ID must be a non-negative number",
          "any.required": "Table customer ID is required",
          "number.integer": "Table customer ID must be an integer",
          "number.min": "Table customer ID must be at least 0",
        }),
      }).messages({
        "object.base": "Each item in the list must be an object",
      })
    )
    .required()
    .messages({
      "array.base": "List of table customer id must be an array",
      "array.min": "List of table customer id must contain at least one item",
      "any.required": "List of table customer id is required",
    }),
});

module.exports = cancelTableSchema;
