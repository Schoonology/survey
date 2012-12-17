var microtime = require('microtime');

function Surveyor(options) {
    if (!(this instanceof Surveyor)) {
        return new Surveyor(options);
    }

    this.verbose = options.verbose || false;
    this.points = {};
}

Surveyor.prototype.addPoint = addPoint;
function addPoint(name) {
    this.points[name] = {
        average: 0,
        count: 0
    };
}

Surveyor.prototype.collectSample = collectSample;
function collectSample(sample, name) {
    var data = this.points[name];
    data.average = (data.count * data.average + sample) / ++data.count;
}

Surveyor.prototype.sampleTest = sampleTest;
function sampleTest(fn, name, callback) {
    var self = this,
        start = microtime.now();

    if (!fn.length) {
        fn();
        self.collectSample(microtime.now() - start, name);
        return callback();
    }

    fn(function finished() {
        self.collectSample(microtime.now() - start, name);
        callback();
    });
}

Surveyor.prototype.sampleRandomTests = sampleRandomTests;
function sampleRandomTests(obj, names, left, callback) {
    var self = this;

    if (left === 0) {
        callback(null, self.points);
        return;
    }

    var index = ~~(Math.random() * names.length),
        name = names[index];

    self.sampleTest(obj[name], name, function () {
        if (self.verbose) {
            console.log('Running ' + name + '. ' + left + ' left.');
        }

        self.sampleRandomTests(obj, names, left - 1, callback);
    });
}

Surveyor.prototype.collectBenchmarks = collectBenchmarks;
function collectBenchmarks(obj, count, callback) {
    var names = Object.keys(obj),
        i;

    if (typeof count === 'function') {
        callback = count;
        count = 1000;
    }

    i = names.length;
    for(;i--;) {
        this.addPoint(names[i]);
    }

    try {
        this.sampleRandomTests(obj, names, count * names.length, callback);
    } catch (e) {
        callback(e);
    }
}

module.exports = Surveyor;
