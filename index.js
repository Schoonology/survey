if (require.main === module) {
    require('./bin/survey')(
        require(
            require('path').join(process.cwd(), process.argv[2])
        )
    );
} else {
    module.exports = require('./lib/survey');
    module.exports.run = require('./bin/survey');
}
