const crypto = require('crypto');


module.exports = {
    //salt 생성
    makeSalt: () => {
        return crypto.randomBytes(32).toString('hex');
    },

    //암호화
    encrypt: (password, salt) => {
        const key = crypto.pbkdf2Sync(password, salt.toString(), 100000, 32, 'sha512');
        return key.toString('hex');
    },
};
