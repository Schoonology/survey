var Surveyor = require('../lib/surveyor');

function run(tests, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = null;
    }

    var surveyor = new Surveyor(tests, options);

    if (callback != null) {
        surveyor.on('complete', function (data) {
            callback(null, data);
        });

    }

    return surveyor.start();
}

module.exports = run;
