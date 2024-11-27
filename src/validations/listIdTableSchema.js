const Joi = require("joi");
const listIdTableSchema = Joi.object({
  listTables: Joi.array()
    .min(1)
    .items(
      Joi.object({
        id: Joi.number().integer().min(0).required().messages({
          "number.base": "Table ID must be a non-negative number",
          "any.required": "Table ID is required",
          "number.integer": "Table ID must be an integer",
          "number.min": "Table ID must be at least 0",
        }),
      }).messages({
        "object.base": "Each item in the list must be an object", // Thông báo lỗi nếu không phải là đối tượng
      })
    )
    .required()
    .messages({
      "array.base": "List of table must be an array",
      "array.min": "List of table must contain at least one item",
      "any.required": "List of table is required",
    }),
});

module.exports = listIdTableSchema;
