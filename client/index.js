var _ = require('underscore');
var moment = require('moment');
var d3 = require('d3');
var color = d3.scale.category20();

var locale = d3.locale({
    "decimal": ".",
    "thousands": ",",
    "grouping": [3],
    "currency": ["$", ""],
    "dateTime": "%a %b %e %X %Y",
    "date": "%m/%d/%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
})

var data = [{
    name: "http requests",
    dates: [new Date('2014/09/15 13:24:54'), new Date('2014/09/15 13:25:03'), new Date('2014/09/15 13:25:05')]
}, {
    name: "SQL queries",
    dates: [new Date('2014/09/15 13:24:57'), new Date('2014/09/15 13:25:04'), new Date('2014/09/15 13:25:04')]
}, {
    name: "cache invalidations",
    dates: [new Date('2014/09/15 13:25:12')]
}];

var fileInput = document.querySelector('#file');
fileInput.addEventListener('change', function(e) {
    var files = e.target.files;
    var f = files[0]
    var reader = new FileReader();

    reader.onload = function(e) {
        var data = d3.csv.parse(e.target.result);
        var tasks = data.reduce(function(result, record) {
            var taskName = record.Project + '-' + record.Notes;
            if (!(taskName in result)) {
                result[taskName] = {
                    name: taskName,
                    dates: []
                };
            }

            var dates = result[taskName].dates;
            var startStr = record.Date + ' ' + record['Started At'];
            var p = /am$/.test(startStr) ? 'am' : 'pm'
            var start = moment(startStr, 'MM/DD/YYYY hh:mm' + p).toDate();
            console.log(startStr, start);
            var end = new Date(start.getTime() + record.Hours * 60 * 1000 * 60);
            var d = start;
            while (d.getTime() < end.getTime()) {
                dates.push(d);
                d = new Date(d.getTime() + 1000 * 60);
            }

            return result;
        }, {});

        tasks = _.map(tasks, function(task) {
            return {
                name: task.name,
                dates: task.dates
            }
        });

        var startDate = tasks.reduce(function(prev, task) {
            var dates = task.dates;
            var date = dates.reduce(function(prev, date) {
                return prev < date ? prev : date;
            });
            return prev < date ? prev : date;
        }, new Date('2024/11/11'));

        var endDate = tasks.reduce(function(prev, task) {
            var dates = task.dates;
            var date = dates.reduce(function(prev, date) {
                return prev > date ? prev : date;
            });
            return prev > date ? prev : date;
        }, new Date(0));

        console.log(tasks);

        var eventDropsChart = require('event-drops')()
            .start(startDate)
            .end(endDate)
            .locale(locale)
            .width(1440)
            .eventColor(function(datum, index) {
                return color(index);
            });

        d3.select('#chart')
            .datum(tasks)
            .call(eventDropsChart);
    };

    reader.readAsText(f);
}, false);