const { ValidationError } = require('sequelize/lib/errors');
const models = require('../models');
const logger = require('../utils/logger');
const { readAccountBalance } = require('./accountService');

//입금 시도
async function tryDeposit(data){
  logger.log("deposit");
  let balance = await readAccountBalance({
    accountNumber: data.accountNumber
  });
  logger.log("before balance : "+balance);

  updateResult = await updateAccountBalance({
    accountNumber: data.accountNumber, 
    balance: balance + data.transactionAmount,
  });
  logger.log("update Result : "+updateResult);

  balance = balance + data.transactionAmount;

  let transaction = await models.transaction({
    transactionAmount: data.transactionAmount,
    briefs: data.briefs,
    transactionType: data.transactionType,
    balance: balance
  }, {raw:true});
  logger.log("transaction : "+transaction);

  return transaction;
}


//출금 시도
async function tryWithdraw(data){
  try{
    logger.log("withdraw");
    let balance = await readAccountBalance({
      accountNumber:data.accountNumber
    });
    logger.log("before balance : "+balance);

    if(data.transactionAmount > balance){
      throw new NOT_ENOUGH_BALANCE_ERROR();
    }

    let updateResult = await updateAccountBalance({
      accountNumber:data.accountNumber, 
      balance: balance - data.transactionAmount,
    });
    logger.log("update Result : "+updateResult);

    balance = balance - data.transactionAmount;

    let transaction = await models.transaction({
      transactionAmount: data.transactionAmount,
      briefs: data.briefs,
      transactionType: data.transactionType,
      balance: balance
    }, {raw:true});
    logger.log("transaction : "+transaction);

    return transaction;
  }catch(err){
    throw err;
  }
}



//거래내역생성
//data.accountNumber
//data.type
//data.transactionAmount
//data.briefs
exports.createTransaction = async (data) => {
  try{
    logger.log("createTransaction data: "+data);
    const t = await sequelize.transaction();

    let transaction;
    switch(data.type){
      case 0:
        transaction = await tryDeposit(data); break;
      case 1: 
        transaction = await tryWithdraw(data); break;
      default: throw ValidationError;
    }

    await t.commit();
    return transaction;
  }catch(err){
    await t.rollback();
    throw err;
  }
}


//거래내역조회
//data.accountNumber
//data.page
//data.begin
//data.end
//data.order
//data.type    //조건들은 undefined로 들어올 수 있음
exports.readTransactionList = async (data) => {

}
