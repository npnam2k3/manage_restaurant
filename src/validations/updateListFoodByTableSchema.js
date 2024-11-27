const Joi = require("joi");
const listFoodTableSchema = Joi.array()
  .min(1)
  .items(
    Joi.object({
      tableId: Joi.number().required().messages({
        "number.base": "Table ID must be a number",
        "any.required": "Table ID is required",
      }),
      listFoods: Joi.array()
        .min(1)
        .items(
          Joi.object({
            id: Joi.number().required().messages({
              "number.base": "Food ID must be a number",
              "any.required": "Food ID is required",
            }),
            quantity: Joi.number().integer().min(1).required().messages({
              "number.base": "Quantity must be a number",
              "any.required": "Quantity is required",
              "number.integer": "Quantity must be an integer",
              "number.min": "Quantity must be at least 1",
            }),
          }).messages({
            "object.base": "Each item in the listFoods must be an object",
          })
        )
        .required()
        .messages({
          "array.base": "listFoods must be an array",
          "array.min": "listFoods must contain at least one item",
          "any.required": "listFoods is required",
        }),
    }).messages({
      "object.base": "Each item in the list must be an object",
    })
  )
  .required()
  .messages({
    "array.base": "The main list must be an array",
    "array.min": "The main list must contain at least one item",
    "any.required": "The main list is required",
  });

module.exports = listFoodTableSchema;
