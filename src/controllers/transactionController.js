const { statusCode, responseMessage } = require('../globals');
const { resFormatter } = require('../utils');
const transactionService = require('../services/transactionService.js');
const accountService = require('../services/accountService.js');
const logger = require('../utils/logger');
const encryption = require("../libs/encryption.js")
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

        //계좌 비밀번호 대조
        //accountPassword

        // 소유주가 아니면 에러처리
        if (userId === undefined) 
            throw new UnAuthorizedError();

        if (type === undefined || transactionAmount === undefined || briefs === undefined
            || accountPassword === undefined || accountNumber === undefined)
            throw new ValidationError();

        //type을 db상의 type으로 타입변경 및 리턴값 사전처리
        let resMessage;
        let rawType = 0;
        switch (type) {
            case "deposit": resMessage = responseMessage.DEPOSIT_SUCCESS; rawType = 0; break;
            case "withdraw": resMessage = responseMessage.WITHDRAW_SUCCESS; rawType = 1;  break;
            default: throw new ValidationError();
        }

        const account = await accountService.findAccountByPk({ accountNumber })
        if (account === undefined) 
            throw new EntityNotExistError();

        const transactionData = {
            accountNumber,
            transactionAmount,
            briefs,
            accountPassword,
            type:rawType,
        }
        const newTransaction = await transactionService.createTransaction(transactionData)


        return res.status(statusCode.OK)
            .send(resFormatter.success(resMessage, { balance:newTransaction.balance }));
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