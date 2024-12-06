const Joi = require("joi");

const revenueDateSchema = Joi.object({
  startDate: Joi.date().required().messages({
    "date.base": "Start date must be a valid date and time",
    "any.required": "Start date is required",
  }),
  endDate: Joi.date().greater(Joi.ref("startDate")).messages({
    "date.base": "End date must be a valid date and time",
    "date.greater": "End date must be greater than start date",
  }),
});

module.exports = revenueDateSchema;
