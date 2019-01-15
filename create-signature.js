const sha256 = require('js-sha256').sha256;

module.exports = (secretKey, expires) => {
    var hash = sha256.create()
    hash.update(secretKey + expires);
    let uplySignature = hash.hex()
    return uplySignature
}
