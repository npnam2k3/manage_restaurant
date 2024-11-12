const Joi = require("joi");
const foodCategorySchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is not allowed to be empty",
    "any.required": "Name is required",
  }),
});

module.exports = foodCategorySchema;
