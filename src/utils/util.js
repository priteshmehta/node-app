
class util {
    //Base64 Encoding
    btoa = function (plainStr) {
        const buff = Buffer.from(plainStr, 'utf-8')
        //decode buffer as Base64
        return buff.toString('base64')
    }

    //Base64 Decoding
    atob = function (base64Str) {
        const buff = Buffer.from(base64Str, 'base64');
        return buff.toString('utf-8');
    }
}

module.exports = util