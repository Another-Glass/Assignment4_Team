const { statusCode, responseMessage } = require('../globals');
const encryption = require('../libs/encryption.js');
const jwt = require('../libs/jwt.js');
const { resFormatter } = require('../utils');
const {
  DuplicatedError,
  PasswordMissMatchError,
  NotMatchedUserError,
} = require('../utils/errors/userError');
const { ValidationError } = require('../utils/errors/commonError');
const { COOKIE_TOKEN_FEILD } = require('../middlewares/auth');

const userService = require('../services/userService.js');
const logger = require('../utils/logger');

//회원가입
exports.postUser = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    //입력값 확인
    if (userId === undefined || password === undefined) {
      throw new ValidationError();
    }

    //이름 중복 여부
    const isExists = await userService.checkUser(userId);
    if (isExists) throw new DuplicatedError();

    //암호화
    const salt = encryption.makeSalt();
    const encryptPassword = encryption.encrypt(password, salt);

    //쿼리실행
    await userService.signup(userId, encryptPassword, salt);

    return res
      .status(statusCode.CREATED)
      .send(resFormatter.success(responseMessage.CREATED_USER));
  } catch (err) {
    next(err);
  }
};

//토큰 생성(로그인)
exports.postToken = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    //입력값 확인
    if (userId === undefined || password === undefined) throw new ValidationError();

    //회원가입 여부 확인
    const isUser = await userService.checkUser(userId);
    if (!isUser) throw new NotMatchedUserError();

    //확인용 암호화
    const { salt, password: realPassword } = isUser;
    const inputPassword = encryption.encrypt(password, salt);

    //패스워드 불일치
    if (inputPassword !== realPassword) throw new PasswordMissMatchError();

    //쿼리 실행
    const user = await userService.signin(userId, inputPassword);

    //토큰 반환

    const jwtResult = await jwt.sign(user);

    const cookieOption = {
      domain: req.hostname,
      // second to milisecond
      expires: new Date(jwtResult.expires * 1000),
    };

    return res
      .cookie(COOKIE_TOKEN_FEILD, jwtResult.accessToken, cookieOption)
      .status(statusCode.OK)
      .send(resFormatter.success(responseMessage.LOGIN_SUCCESS, {}));
  } catch (err) {
    next(err);
  }
};

//로그인 페이지 접속
exports.getTokenPage = async (req, res, next) => {
  try {
    return res.render('login.html');
  } catch (err) {
    next(err);
  }
};
