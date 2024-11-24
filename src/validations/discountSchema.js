const Joi = require("joi");

const discountSchema = Joi.object({
  code: Joi.string().trim().required().messages({
    "string.empty": "Code is not allowed to be empty",
    "any.required": "Code is required",
  }),
  description: Joi.string().trim().messages({
    "string.empty": "Description is not allowed to be empty",
  }),
  discount_amount: Joi.number().integer().min(0).required().messages({
    "number.base": "Discount amount must be a number",
    "number.integer": "Discount amount must be an integer",
    "number.min": "Discount amount must be at least 0",
    "any.required": "Discount amount is required",
  }),
  discount_type: Joi.string()
    .valid("percentage", "amount")
    .required()
    .messages({
      "any.only": "Discount type must be either 'percentage' or 'amount'",
      "any.required": "Discount type is required",
    }),
  min_order_value: Joi.number().integer().min(0).messages({
    "number.base": "Min order value must be a number",
    "number.integer": "Min order value must be an integer",
    "number.min": "Min order value must be at least 0",
  }),
  start_date: Joi.date().min("now").required().messages({
    "date.base": "Start date must be a valid date and time",
    "date.min": "Start date must be greater than or equal to the current date",
    "any.required": "Start date is required",
  }),
  end_date: Joi.date().greater(Joi.ref("start_date")).required().messages({
    "date.base": "End date must be a valid date and time",
    "date.greater": "End date must be greater than start date",
    "any.required": "End date is required",
  }),
  is_anniversary: Joi.boolean().required().messages({
    "boolean.base": "Is anniversary must be a boolean value",
    "any.required": "Is anniversary is required",
  }),
  purchased_orders_count: Joi.number().integer().min(0).messages({
    "number.base": "Purchased orders count must be a number",
    "number.integer": "Purchased orders count must be an integer",
    "number.min": "Purchased orders count must be at least 0",
  }),
  purchased_amount_per_order: Joi.number().integer().min(0).messages({
    "number.base": "Purchased amount per order must be a number",
    "number.integer": "Purchased amount per order must be an integer",
    "number.min": "Purchased amount per order must be at least 0",
  }),
});

module.exports = discountSchema;
