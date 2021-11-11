const jwt = require('../libs/jwt.js');
const util = require('../utils/resFormatter.js');
const statusCode = require('../globals').statusCode;
const responseMessage = require('../globals').responseMessage;

//토큰 만료
const TOKEN_EXPIRED = -3;
//토큰 무효
const TOKEN_INVALID = -2;

const COOKIE_TOKEN_FEILD = 'AG3_JWT'

//토큰 확인
exports.checkToken = async (req, res, next) => {
    //const authorization = req.headers.authorization;
    const authorization = req.cookies[COOKIE_TOKEN_FEILD]

    //토큰이 없는경우
    if (!authorization) {
        return res.status(statusCode.UNAUTHORIZED)
            .send(util.fail(responseMessage.EMPTY_TOKEN));
    }

    //토큰 인증(확인)
    const user = await jwt.verify(authorization);

    //토큰 만료되는 경우 
    if (user === TOKEN_EXPIRED) {
        return res.status(statusCode.UNAUTHORIZED)
            .send(util.fail(responseMessage.EXPIRED_TOKEN));
    }
    
    //토큰 무효되는 경우
    if (user === TOKEN_INVALID) {
        return res.status(statusCode.UNAUTHORIZED)
            .send(util.fail(responseMessage.INVALID_TOKEN));
    }
    if (user.id === undefined) {
        return res.status(statusCode.UNAUTHORIZED)
            .send(util.fail(responseMessage.INVALID_TOKEN));
    }
    req.decoded = user;
    next();
}

module.exports.COOKIE_TOKEN_FEILD = COOKIE_TOKEN_FEILD