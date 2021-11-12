const models = require('../models');
const { EntityNotExistError } = require('../utils/errors/commonError');
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
//data.accountNumber
//return {password, salt}
exports.readAccountPassword = async (data) => {
  try {
    const account = await models.account.findByPk(data.accountNumber, {
      raw: true
    });

    if (account == undefined) throw new EntityNotExistError();

    return {
      password: account.password,
      salt: account.salt
    };
  } catch (err) {
    throw err;
  }

}

//계좌 잔고 조회
//data.accountNumber
exports.readAccountBalance = async (data) => {
  try {
    const account = await models.account.findByPk(data.accountNumber, {
      raw:true
    });

    if(account == undefined) throw new EntityNotExistError();

    return account.balance;
  } catch (err) {
    throw err;
  }
}

//계좌 잔고 변경
//data.accountNumber
//data.balance
exports.updateAccountBalance = async (data) => {
  try {
    const account = await models.account.update({ balance: data.balance }, {
      where: {
        accountNumber: data.accountNumber
      }
    });
    
    if(account == undefined) throw new EntityNotExistError();

    return account;
  } catch (err) {
    throw err;
  }

}

//accountNumber로 계좌 검색
//data.accountNumber
exports.findAccountByPk = async (data) => {
  try {
    const account = await models.account.findByPk(data.accountNumber);

    return account;
  } catch (err) {
    throw err;
  }
}
