const Joi = require("joi");
const tableSchema = Joi.object({
  number: Joi.number().min(1).required().messages({
    "number.base": "Number of table must be a number",
    "any.required": "Table number is required",
    "number.min": "Table number must be at least 1",
  }),
  seat_number: Joi.number().min(2).required().messages({
    "number.base": "Seat number must be a number",
    "any.required": "Seat number is required",
    "number.min": "Seat number must be at least 2",
  }),
});

module.exports = tableSchema;
