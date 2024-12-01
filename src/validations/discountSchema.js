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
  // start_date: Joi.date().greater("now").required().messages({
  //   "date.base": "Start date must be a valid date and time",
  //   "date.greater":
  //     "Start date must be greater than or equal to the current date",
  //   "any.required": "Start date is required",
  // }),
  start_date: Joi.date()
    .custom((value, helpers) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây, mili giây về 0
      if (value < today) {
        return helpers.error("date.greater", {
          message:
            "Start date must be greater than or equal to the current date",
        });
      }
      return value; // Trả về giá trị hợp lệ
    })
    .required()
    .messages({
      "date.base": "Start date must be a valid date and time",
      "any.required": "Start date is required",
    }),
  end_date: Joi.date().greater(Joi.ref("start_date")).required().messages({
    "date.base": "End date must be a valid date and time",
    "date.greater": "End date must be greater than start date",
    "any.required": "End date is required",
  }),
  is_anniversary: Joi.number().required().messages({
    "number.base": "Is anniversary must be a number",
    "any.required": "Is anniversary is required",
  }),
  is_loyalty_customer: Joi.number().required().messages({
    "number.base": "Is loyalty customer must be a number",
    "any.required": "Is loyalty customer is required",
  }),
  total_money_spent: Joi.number().integer().min(0).messages({
    "number.base": "Total money spent must be a number",
    "number.integer": "Total money spent must be an integer",
    "number.min": "Total money spent must be at least 0",
  }),
});

module.exports = discountSchema;
