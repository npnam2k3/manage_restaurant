const Joi = require("joi");

const discountUpdateSchema = Joi.object({
  description: Joi.string().trim().messages({
    "string.empty": "Description is not allowed to be empty",
  }),
  discount_amount: Joi.number().integer().min(0).messages({
    "number.base": "Discount amount must be a number",
    "number.integer": "Discount amount must be an integer",
    "number.min": "Discount amount must be at least 0",
  }),
  discount_type: Joi.string().valid("percentage", "amount").messages({
    "any.only": "Discount type must be either 'percentage' or 'amount'",
  }),
  min_order_value: Joi.number().integer().min(0).messages({
    "number.base": "Min order value must be a number",
    "number.integer": "Min order value must be an integer",
    "number.min": "Min order value must be at least 0",
  }),
  start_date: Joi.date().min("now").messages({
    "date.base": "Start date must be a valid date and time",
    "date.min": "Start date must be greater than or equal to the current date",
  }),
  end_date: Joi.date().greater(Joi.ref("start_date")).messages({
    "date.base": "End date must be a valid date and time",
    "date.greater": "End date must be greater than start date",
  }),
  is_anniversary: Joi.boolean().messages({
    "boolean.base": "Is anniversary must be a boolean value",
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

module.exports = discountUpdateSchema;
