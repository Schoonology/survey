var Surveyor = require('./surveyor'),
    run = require('./run');

function createSurveyor() {
    return new module.exports.Surveyor();
}

module.exports = {
    Surveyor: Surveyor,
    createSurveyor: createSurveyor,
    run: run
};
