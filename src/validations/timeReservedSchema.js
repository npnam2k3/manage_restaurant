const Joi = require("joi");
const timeReservedSchema = Joi.object({
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

module.exports = timeReservedSchema;
