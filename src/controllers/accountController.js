const { statusCode, responseMessage } = require('../globals');
const { resFormatter } = require('../utils');
const accountService = require('../services/accountService.js');
const userService = require('../services/userService.js');
const { DuplicatedError } = require('../utils/errors/userError');
const encryption = require('../libs/encryption.js');
const logger = require('../utils/logger');
const ValidationError = require('../utils/errors/commonError');
const encryption = require('../libs/encryption');

  //계좌생성
exports.postAccount = async(req, res, next) => {
  const { accountPassword } = req.body;
  const { id } = req.decoded;

  if(accountPassword === undefined || id === undefined) {
    throw new ValidationError()
  }
  
  const salt = encryption.makeSalt();
  const encryptPassword = encryption.encrypt(accountPassword, salt);
  
  const dto = {
    id, 
    password: encryptPassword,
    salt
  }

  const newAccount = await accountService.createAccount(dto)
  return res
        .status(statusCode.CREATED)
        .send(resFormatter.success(responseMessage.ACCOUNT_CREATED, newAccount))
}
  
