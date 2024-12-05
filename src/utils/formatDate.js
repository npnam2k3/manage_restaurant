const moment = require("moment");

const formatDate = (date) => {
  const time = moment(date).format("YYYY-MM-DD HH:mm:ss");
  return time;
};

const convertToDate = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

const formatTime = (date) => {
  return moment(date).format("HH:mm:ss");
};

module.exports = {
  formatDate,
  convertToDate,
  formatTime,
};
