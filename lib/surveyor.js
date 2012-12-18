var util = require('util'),
    EventEmitter = require('events').EventEmitter;

function Surveyor(tests, options) {
    if (!(this instanceof Surveyor)) {
        return new Surveyor(options);
    }

    EventEmitter.call(this);

    if (options == null) {
        options = {};
    }

    this.verbose = options.verbose || false;
    this.count = options.count || 1000;
    this.running = false;

    this.tests = tests;
    this.names = Object.keys(tests);
    this.total = this.left = this.count * this.names.length;

    this.points = {};
}
util.inherits(Surveyor, EventEmitter);

Surveyor.prototype.start = start;
function start() {
    this.running = true;
    this.next();

    return this;
}

Surveyor.prototype.next = next;
function next() {
    var self = this;

    if (!self.running || self.left === 0) {
        return;
    }

    var index = Math.floor(Math.random() * self.names.length),
        name = self.names[index];

    self.sampleTest(self.tests[name], name, function testComplete() {
        self.left--;

        if (self.left === 0) {
            self.emit('complete', self.points);
        }

        self.next();
    });
}

Surveyor.prototype.stop = stop;
function stop() {
    this.running = false;

    return this;
}

Surveyor.prototype.collectSample = collectSample;
function collectSample(sample, name) {
    var data = this.points[name] || (this.points[name] = {
            average: 0,
            count: 0
        }),
        microsecs = sample[0] * 1000000 + sample[1] / 1000;

    data.average = (data.count * data.average + microsecs) / ++data.count;

    this.emit('sample', {
        name: name,
        duration: microsecs
    });
}

Surveyor.prototype.sampleTest = sampleTest;
function sampleTest(fn, name, callback) {
    var self = this,
        start;

    function finish() {
        self.collectSample(process.hrtime(start), name);
        callback();
    }

    start = process.hrtime();

    if (fn.length === 0) {
        fn();
        return finish();
    }

    fn(finish);
}

module.exports = Surveyor;
