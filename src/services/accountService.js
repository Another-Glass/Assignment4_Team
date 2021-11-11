const models = require('../models');
const logger = require('../utils/logger');


//계좌생성
//data.username
//data.password
//data.salt
exports.createAccount = async (data) => {
  try {
    const newAccount = await models.account.create({
      userId: data.id,
      password: data.password,
      salt: data.salt  
    })
    return newAccount;
  } catch (err) {
    throw (err);
  }
}


//계좌 기본정보 조회
//data.accountId
//return {password, salt}
exports.readAccountPassword = async (data) => {

}
