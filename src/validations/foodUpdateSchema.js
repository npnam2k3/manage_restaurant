const Joi = require("joi");
const foodUpdateSchema = Joi.object({
  name: Joi.string().trim().messages({
    "string.empty": "Name of food is not allowed to be empty",
  }),
  image_url: Joi.string()
    .trim()
    .allow(null, "") // Cho phép null và chuỗi rỗng
    .messages({
      "string.base": "Image URL must be a string",
    }),
  price: Joi.number()
    .min(0) // giá phải là số không âm
    .messages({
      "number.base": "Price must be a number",
      "number.min": "Price must be a non-negative number", // Thông báo lỗi nếu giá nhỏ hơn 0
    }),
  category_id: Joi.number()
    .min(0) // category_id phải là số không âm
    .messages({
      "number.base": "Category ID must be a number",
      "number.min": "Category ID must be a non-negative number", // Thông báo lỗi nếu category_id nhỏ hơn 0
    }),
  unit_id: Joi.number()
    .min(0) // unit_id phải là số không âm
    .messages({
      "number.base": "Unit ID must be a number",
      "number.min": "Unit ID must be a non-negative number", // Thông báo lỗi nếu unit_id nhỏ hơn 0
    }),
  description: Joi.string().trim().messages({
    "string.empty": "Description of food is not allowed to be empty",
  }),
});

module.exports = foodUpdateSchema;
