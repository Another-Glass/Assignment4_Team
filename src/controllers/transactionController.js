const { statusCode, responseMessage } = require('../globals');
const { resFormatter } = require('../utils');
const transactionService = require('../services/transactionService.js');
const accountService = require('../services/accountService.js');
const logger = require('../utils/logger');
const { EntityNotExistError, ValidationError, UnAuthorizedError } = require('../utils/errors/commonError');


/* "type":"in",
"transactionAmount":10000,
"briefs":"월급",
"accountPassword": "1234" */

//입출금
exports.postTransaction = async (req, res, next) => {
    try {
        const userId = req.decoded.userId;
        const accountNumber = req.params.accountNumber;
        const { type, transactionAmount, briefs, accountPassword } = req.body;

        // 소유주가 아니면 에러처리
        if (userId === undefined) throw new UnAuthorizedError();

        // 입력값이 하나라도 없으면 에러처리 NULL_VALUE : 400
        if (type === undefined || transactionAmount === undefined || briefs === undefined
            || accountPassword === undefined || accountNumber === undefined)
            throw new ValidationError()

        let message;
        switch (type) {
            case 0: message = responseMessage.DEPOSIT_SUCCESS; break;
            case 1: message = responseMessage.WITHDRAW_SUCCESS; break;
            default: throw new ValidationError();
        }

        // 계좌DB가 없으면 에러처리 ENTITY_NOT_EXIST 404
        const account = await accountService.findAccountByAccountId({ accountNumber: accountNumber })
        if (account === undefined) throw new EntityNotExistError();

        //입출금 실행
        const transaction = await transactionService.createTransaction()


        return res.status(statusCode.OK)
            .send(resFormatter.success(message, transaction));
    }
    catch (err) {
        next(err);
    }

}


//계좌 조회
exports.getTransaction = async (req, res, next) => {
    try {
        const accountNumber = req.params.accountNumber;
    }
    catch (err) {
        next(err);
    }
}