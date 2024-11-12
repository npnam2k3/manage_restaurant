const Joi = require("joi");
const foodCategoryUpdateSchema = Joi.object({
  name: Joi.string().trim().messages({
    "string.empty": "Name is not allowed to be empty",
  }),
});

module.exports = foodCategoryUpdateSchema;
