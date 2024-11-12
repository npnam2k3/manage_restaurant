const moment = require("moment");

const getDateTime = (data) => {
  return moment(data).format("DD-MM-YYYY hh:mm a");
};

module.exports = getDateTime;
