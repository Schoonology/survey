var microtime = require('microtime'),
    averages = {};

function prepSample(name) {
    averages[name] = {
        average: 0,
        count: 0
    };
}

function collectSample(sample, name) {
    var data = averages[name];
    data.average = (data.count * data.average + sample) / ++data.count;
}

function runTest(fn, name, callback) {
    var start = microtime.now();

    if (!fn.length) {
        fn();
        collectSample(microtime.now() - start, name);
        return callback();
    }

    fn(function finished() {
        collectSample(microtime.now() - start, name);
        callback();
    });
}

function runRandomTests(obj, names, left, callback) {
    if (left === 0) {
        callback(null, averages);
        return;
    }

    var index = ~~(Math.random() * names.length),
        name = names[index];

    runTest(obj[name], name, function () {
        runRandomTests(obj, names, left - 1, callback);
    });
}

function startEngine(obj, count, callback) {
    var names = Object.keys(obj),
        i;

    i = names.length;
    for(;i--;) {
        prepSample(names[i]);
    }

    try {
        runRandomTests(obj, names, count * names.length, callback);
    } catch (e) {
        callback(e);
    }
}

module.exports = startEngine;
