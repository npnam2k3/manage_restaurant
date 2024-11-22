const Joi = require("joi");
const foodSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name of food is not allowed to be empty",
    "any.required": "Name of food is required",
  }),
  image_url: Joi.string()
    .trim()
    .allow(null, "") // Cho phép null và chuỗi rỗng
    .messages({
      "string.base": "Image URL must be a string",
    }),
  price: Joi.number()
    .min(0) // giá phải là số không âm
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.min": "Price must be a non-negative number", // Thông báo lỗi nếu giá nhỏ hơn 0
      "any.required": "Price is required",
    }),
  category_id: Joi.number()
    .min(0) // category_id phải là số không âm
    .required()
    .messages({
      "number.base": "Category ID must be a number",
      "number.min": "Category ID must be a non-negative number", // Thông báo lỗi nếu category_id nhỏ hơn 0
      "any.required": "Category ID is required",
    }),
  unit_id: Joi.number()
    .min(0) // unit_id phải là số không âm
    .required()
    .messages({
      "number.base": "Unit ID must be a number",
      "number.min": "Unit ID must be a non-negative number", // Thông báo lỗi nếu unit_id nhỏ hơn 0
      "any.required": "Unit ID is required",
    }),
  description: Joi.string().trim().messages({
    "string.empty": "Description of food is not allowed to be empty",
  }),
});

module.exports = foodSchema;
