const moment = require("moment");

function buildBeginningOfMonthDate(date /*: Date */ = new Date()) {
  return moment(date).startOf("month").toDate();
}

function buildBeginningOfWeekDate(date /*: Date */ = new Date()) {
  return moment(date).startOf("week").toDate();
}

function isGameAfterDate(date /*: Date */) {
  return (game /*: Game */) => {
    return new Date(game.date) >= date;
  };
}

module.exports = {
  buildBeginningOfMonthDate,
  buildBeginningOfWeekDate,
  isGameAfterDate
};
