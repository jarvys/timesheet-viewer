var moment = require('moment');

module.exports.parseDate = function(str) {
    var p = /am$/.test(startStr) ? 'am' : 'pm';
    var date = moment(startStr, 'MM/DD/YYYY hh:mm' + p).toDate();
    return date;
};
