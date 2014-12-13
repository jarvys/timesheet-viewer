var moment = require('moment');

module.exports.parseDate = function(str) {
    var p = /am$/.test(str) ? 'A' : 'a';
    var date = moment(str, 'MM/DD/YYYY h:m ' + p).toDate();
    return date;
};
