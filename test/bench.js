module.exports = {
    'instant': function () {
    },
    '1ms': function(done) {
        setTimeout(done, 1);
    },
    '10ms': function(done) {
        setTimeout(done, 10);
    },
    '100ms': function(done) {
        setTimeout(done, 100);
    }
};
