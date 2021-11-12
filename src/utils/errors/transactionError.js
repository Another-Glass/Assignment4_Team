const statusCode = require('../../globals/statusCode');
const responseMessage = require('../../globals/responseMessage');
const Error = require('./errors');

//잔액부족
class NotEnoughBalanceError extends Error {
  constructor(message = responseMessage.NOT_ENOUGH_BALANCE, status = statusCode.BAD_REQUEST) {
    super(message);
    this.status = status;
  }
}

class AccountNotExistsError extends Error {
  constructor(message = responseMessage.ACCOUNT_NOT_FOUND, status = statusCode.NOT_FOUND) {
    super(message);
    this.status = status;
  }
}

module.exports.NotEnoughBalanceError = NotEnoughBalanceError;
module.exports.AccountNotExistsError = AccountNotExistsError;
