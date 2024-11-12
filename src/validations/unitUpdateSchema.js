const Joi = require("joi");
const unitUpdateSchema = Joi.object({
  name: Joi.string().trim().messages({
    "string.empty": "Name is not allowed to be empty",
  }),
  description: Joi.string().trim().messages({
    "string.empty": "Description is not allowed to be empty",
  }),
});

module.exports = unitUpdateSchema;
