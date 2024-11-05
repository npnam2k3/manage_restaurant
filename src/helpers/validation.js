"use strict";
const validateHelper = (schema, data) => {
  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  validateHelper,
};
