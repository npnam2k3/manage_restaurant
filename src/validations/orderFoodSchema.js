const Joi = require("joi");
const orderFoodSchema = Joi.object({
  tableId: Joi.number().integer().min(0).required().messages({
    "number.base": "Table ID must be a non-negative number",
    "any.required": "Table ID is required",
    "number.integer": "Table ID must be an integer",
    "number.min": "Table ID must be at least 0",
  }),
  listFood: Joi.array()
    .min(1)
    .items(
      Joi.object({
        id: Joi.number().integer().min(0).required().messages({
          "number.base": "Food ID must be a non-negative number",
          "any.required": "Food ID is required",
          "number.integer": "Food ID must be an integer",
          "number.min": "Food ID must be at least 0",
        }),
        quantity: Joi.number().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "any.required": "Quantity is required",
          "number.min": "Quantity must be at least 1",
        }),
      }).messages({
        "object.base": "Each item in the list must be an object", // Thông báo lỗi nếu không phải là đối tượng
      })
    )
    .required()
    .messages({
      "array.base": "List of food must be an array",
      "array.min": "List of food must contain at least one item",
      "any.required": "List of food is required",
    }),
});

module.exports = orderFoodSchema;
