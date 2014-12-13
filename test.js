var assert = require('assert');
var moment = require('moment');
var util = require('./util');

describe('#parseDate', function() {
    it('should detect am or pm', function() {
        assert.equal(util.parseDate('11/11/2014 11:11am').getTime(),
            moment('2014-11-11 11:11:00', 'YYYY-MM-DD HH:mm:ss').toDate().getTime());
        assert.equal(util.parseDate('11/11/2014 2:19pm').getTime(),
            moment('2014-11-11 14:19:00', 'YYYY-MM-DD HH:mm:ss').toDate().getTime());
    });
});