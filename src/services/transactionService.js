const { ValidationError } = require('sequelize/lib/errors');
const models = require('../models');
const { NotEnoughBalanceError } = require('../utils/errors/transactionError');
const logger = require('../utils/logger');
const { readAccountBalance, updateAccountBalance } = require('./accountService');
const logTag = 'src:transaction';

//거래내역생성
//data.accountNumber
//data.type
//data.transactionAmount
//data.briefs
exports.createTransaction = async (data) => {
  const t = await models.sequelize.transaction();

  try{
    //log logger.logWithTag("createTransaction data: "+JSON.stringify(data), logTag);

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


//입금 시도
async function tryDeposit(data){
  try{
    //log logger.logWithTag("deposit", logTag);
    let balance = await readAccountBalance({
      accountNumber: data.accountNumber
    });
    //log logger.logWithTag("before balance : "+balance, logTag);

    updateResult = await updateAccountBalance({
      accountNumber: data.accountNumber, 
      balance: balance + data.transactionAmount,
    });
    //log logger.logWithTag("update Result : "+updateResult, logTag);

    balance = balance + data.transactionAmount;

    let transaction = await models.transaction.create({
      transactionAmount: data.transactionAmount,
      briefs: data.briefs,
      transactionType: data.type,
      balance: balance
    }, {raw:true});
    //log logger.logWithTag("transaction : "+transaction, logTag);

    return transaction;
  }catch(err){
    throw err;
  }
}

//출금 시도
async function tryWithdraw(data){
  try{
    //log logger.logWithTag("withdraw", logTag);
    let balance = await readAccountBalance({
      accountNumber:data.accountNumber
    });
    //log logger.logWithTag("before balance : "+balance, logTag);

    if(data.transactionAmount > balance){
      throw new NotEnoughBalanceError();
    }

    let updateResult = await updateAccountBalance({
      accountNumber:data.accountNumber, 
      balance: balance - data.transactionAmount,
    });
    //log logger.logWithTag("update Result : "+updateResult, logTag);

    balance = balance - data.transactionAmount;

    let transaction = await models.transaction.create({
      transactionAmount: data.transactionAmount,
      briefs: data.briefs,
      transactionType: data.type,
      balance: balance
    }, {raw:true});
    //log //log logger.logWithTag("transaction : "+transaction, logTag);

    return transaction;
  }catch(err){
    throw err;
  }
}