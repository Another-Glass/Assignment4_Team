const models = require('../models');
const logger = require('../utils/logger');


//계좌생성
//data.userId
//data.password
//data.salt
exports.createAccount = async (data) => {
  try {
    const newUser = await models.account.create({
      userId: data.userId,
      password: data.password,
      salt: data.salt,
    });
    return newUser;
  } catch (err) {
    throw err;
  }
}


//계좌 기본정보 조회
//data.accountId
//return {password, salt}
exports.readAccountPassword = async (data) => {

}

//계좌 잔고 조회
//data.accountId
exports.readAccountBalance = async (data) => {

}

//계좌 잔고 변경
//data.balance -- 그대로 반영
exports.updateAccountBalance = async (data) => {

}

//accountId로 계좌 검색
//data.accountNumber
exports.findAccountByAccountId = async (data) => {
  try {
    let account = await models.account.findByPk(data.accountNumber);

    return account;
  } catch (err) {
    throw err;
  }
}
