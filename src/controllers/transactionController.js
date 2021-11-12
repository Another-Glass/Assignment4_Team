const { statusCode, responseMessage } = require('../globals');
const { resFormatter } = require('../utils');
const transactionService = require('../services/transactionService.js');
const accountService = require('../services/accountService.js');
const logger = require('../utils/logger');
const encryption = require("../libs/encryption.js")
const { EntityNotExistError, ValidationError, UnAuthorizedError } = require('../utils/errors/commonError');
const { PasswordMissMatchError } = require('../utils/errors/userError');


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

        // 비밀번호가 일치 하지 않으면 에러처리 
        const { salt, password: realPassword } =  await accountService.readAccountPassword({accountNumber});
        const inputPassword = encryption.encrypt(String(accountPassword), salt);

        // 패스워드 불일치
        if (inputPassword !== realPassword)
            throw new PasswordMissMatchError();
        
        // 토큰이 유효하지 않으면 에러처리
        if (userId === undefined) 
            throw new UnAuthorizedError();

        // 입력값이 잘 들어오지 않는다면 에러처리
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


//거래내역 조회
exports.getTransaction = async (req, res, next) => {
    try {
       
        
    }
    catch (err) {
        next(err);
    }
}