const moment = require("moment");

const getDateTime = (data) => {
  return moment(data).format("DD-MM-YYYY HH:mm");
};

module.exports = getDateTime;
