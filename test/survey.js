/*global describe:true, it:true, before:true, after:true, beforeEach:true, afterEach:true */
var expect = require('chai').expect,
    survey = require('../lib/survey');

describe('Survey', function () {
    before(function () {
        this.run = function (obj, count, callback) {
            var surveyor = new survey.createSurveyor();

            surveyor.collectBenchmarks(obj, count, callback);
        };
    });

    it('should run the benchmarks provided in `obj`', function (done) {
        var ran = false;

        this.run({
            test: function () {
                ran = true;
            }
        }, function () {
            expect(ran).to.be.true;
            done();
        });
    });

    it('should run the provided benchmarks `count` times', function (done) {
        var ran = 0,
            count = 100;

        this.run({
            test: function () {
                ran++;
            }
        }, count, function () {
            expect(ran).to.equal(count);
            done();
        });
    });

    it('should return a set of averages and counts, organized by name', function (done) {
        var count = 100;

        this.run({
            test: function () {
            }
        }, count, function (err, data) {
            expect(err).to.not.exist;
            expect(data).to.have.property('test');
            expect(data.test).to.have.property('average').to.be.a('number');
            expect(data.test).to.have.property('count').to.equal(count);
            done();
        });
    });

    it('should return an error if a test throws', function (done) {
        var count = 100;

        this.run({
            test: function () {
                throw new Error('Fail');
            }
        }, count, function (err, data) {
            expect(err).to.exist;
            expect(err).to.be.an.instanceof(Error);
            expect(err).to.have.property('message', 'Fail');
            expect(data).to.not.exist;
            done();
        });
    });

    it('should provide a callback to asynchronous benchmarks', function (done) {
        this.run({
            test: function (fn) {
                expect(fn).to.exist;
                done();
            }
        }, 1, function () {});
    });

    it('should not provide a callback to synchronous benchmarks', function (done) {
        this.run({
            test: function () {
                expect(arguments[0]).to.not.exist;
                done();
            }
        }, 1, function () {});
    });
});
