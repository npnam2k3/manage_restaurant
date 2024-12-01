const { date } = require("joi");
const moment = require("moment");

const formatDate = (date) => {
  return moment(date).format("YYYY-MM-DD h:mm:ss a");
};

const convertToDate = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

module.exports = {
  formatDate,
  convertToDate,
};
