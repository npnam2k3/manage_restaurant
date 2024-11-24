const { date } = require("joi");
const moment = require("moment");

const formatDate = (date) => {
  return moment(date).format("YYYY-MM-DD h:mm:ss a");
};

module.exports = {
  formatDate,
};
