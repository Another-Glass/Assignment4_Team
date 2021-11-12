const { statusCode, responseMessage } = require('../globals');
const { resFormatter } = require('../utils');
const accountService = require('../services/accountService.js');
const userService = require('../services/userService.js');
const encryption = require('../libs/encryption.js');
const logger = require('../utils/logger');
const { ValidationError } = require('../utils/errors/commonError');

//계좌생성
exports.postAccount = async (req, res, next) => {
  try {
    const { accountPassword } = req.body;
    const { userId } = req.decoded;

    if (accountPassword === undefined || userId === undefined) {
      throw new ValidationError();
    }

    const salt = encryption.makeSalt();
    const encryptPassword = encryption.encrypt(accountPassword, salt);

    const dto = {
      userId,
      password: encryptPassword,
      salt,
    };

    const newAccount = await accountService.createAccount(dto);
    return res.status(statusCode.CREATED).send(
      resFormatter.success(responseMessage.ACCOUNT_CREATED, {
        accountNumber: newAccount.accountNumber,
      }),
    );
  } catch (err) {
    next(err);
  }
};
