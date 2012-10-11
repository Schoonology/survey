var Surveyor = require('../lib/surveyor'),
    Table = require('cli-table');

function run(tests, count, callback) {
    if (typeof count === 'function') {
        callback = count;
        count = null;
    }

    if (callback == null) {
        callback = console.log;
    }

    var surveyor = new Surveyor();

    surveyor.collectBenchmarks(tests, count || 1000, function (err, data) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var table = new Table({
                head: ['Name', 'Actual Count', 'Average Duration (µs)'],
                colWidths: [100, 50, 50]
            });

        Object.keys(data).map(function (name) {
            return {
                name: name,
                count: data[name].count,
                average: data[name].average
            };
        }).sort(function compare(a, b) {
            return a.average - b.average;
        }).forEach(function (item) {
            table.push([item.name, item.count, ~~item.average]);
        });

        callback(table.toString());
    });
}

module.exports = run;
