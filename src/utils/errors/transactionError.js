const statusCode = require('../../globals/statusCode');
const responseMessage = require('../../globals/responseMessage');
const Error = require('./errors');

class NotEnoughBalanceError extends Error { // 404
  constructor(message = responseMessage.NOT_ENOUGH_BALANCE, status = statusCode.BAD_REQUEST) {
    super(message);
    this.status = status;
  }
}

module.exports.NotEnoughBalanceError = NotEnoughBalanceError;