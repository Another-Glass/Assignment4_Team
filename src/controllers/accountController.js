const { statusCode, responseMessage } = require('../globals');
const { resFormatter } = require('../utils');
const accountService = require('../services/accountService.js');
const userService = require('../services/userService.js');
const { DuplicatedError } = require('../utils/errors/userError');
const encryption = require('../libs/encryption.js');
const logger = require('../utils/logger');

  //계좌생성
exports.postAccount = async(req, res, next) => {
  try {
    const { accountPassword } = req.body;
    const { userId } = req.decoded;

    logger.log(req.body);
    //입력값 확인
    if (userId === undefined || accountPassword === undefined) {
      throw new ValidationError();
    }

    //암호화
    const salt = encryption.makeSalt();
    const encryptPassword = encryption.encrypt(accountPassword, salt);

    const data = {
      userId:userId,
      password:encryptPassword,
      salt:salt
    }
    //쿼리실행
    let account = await accountService.createAccount(data);
    console.log(account);

    return res.status(statusCode.CREATED)
      .send(resFormatter.success(responseMessage.CREATED_USER, account));
  } catch (err) {
    next(err);
  }
}
  
