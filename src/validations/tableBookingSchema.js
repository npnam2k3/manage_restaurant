const Joi = require("joi");
const tableBookingSchema = Joi.object({
  listTable: Joi.array()
    .min(1)
    .items(
      Joi.object({
        id: Joi.number().min(1).required().messages({
          "number.base": "Table ID must be a non-negative number",
          "any.required": "Table ID is required",
          "number.min": "Table ID must be at least 0",
        }),
      }).messages({
        "object.base": "Each item in the list must be an object", // Thông báo lỗi nếu không phải là đối tượng
      })
    )
    .required()
    .messages({
      "array.base": "List table must be an array",
      "array.min": "List table must contain at least one item",
      "any.required": "List table is required",
    }),
  customer_name: Joi.string()
    .pattern(/^[a-zA-ZÀ-ỹ\s]+$/)
    .trim()
    .required()
    .messages({
      "string.empty": "Customer name is not allowed to be empty",
      "string.pattern.base":
        "Customer name must contain only letters and spaces, no special characters or numbers allowed",
      "any.required": "Customer name is required",
    }),
  phone_number: Joi.string()
    .pattern(/^(0|84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)
    .trim()
    .required()
    .messages({
      "string.empty": "Phone number is not allowed to be empty",
      "string.pattern.base":
        "Phone number must be a valid Vietnamese phone number",
      "any.required": "Phone number is required",
    }),
  type_booking: Joi.string().valid("direct", "remote").required().messages({
    "any.only": "Type booking must be either 'direct' or 'remote'",
    "any.required": "Type booking is required",
  }),
  time_reserved: Joi.date()
    .custom((value, helpers) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây, mili giây về 0
      if (value < today) {
        return helpers.error("date.greater", {
          message:
            "Time reserved must be greater than or equal to the current date",
        });
      }
      return value; // Trả về giá trị hợp lệ
    })
    .messages({
      "date.base": "Time reserved must be a valid date and time",
      "any.required": "Time reserved is required",
    }),
});

module.exports = tableBookingSchema;
