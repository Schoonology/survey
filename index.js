if (require.main === module) {
    require('./bin/survey');
} else {
    module.exports = require('./lib/survey');
}
