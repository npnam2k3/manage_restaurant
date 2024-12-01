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
  start_date: Joi.date().messages({
    "date.base": "Start date must be a valid date and time",
  }),
  end_date: Joi.date().greater(Joi.ref("start_date")).messages({
    "date.base": "End date must be a valid date and time",
    "date.greater": "End date must be greater than start date",
  }),
  is_anniversary: Joi.number().messages({
    "number.base": "Is anniversary must be a number",
  }),
  is_loyalty_customer: Joi.number().messages({
    "number.base": "Is loyalty customer must be a number",
  }),
  total_money_spent: Joi.number().integer().min(0).messages({
    "number.base": "Total money spent must be a number",
    "number.integer": "Total money spent must be an integer",
    "number.min": "Total money spent must be at least 0",
  }),
});

module.exports = discountUpdateSchema;
