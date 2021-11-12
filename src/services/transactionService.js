const { InternalServerError } = require('http-errors');
const { ValidationError } = require('sequelize/lib/errors');
const models = require('../models');
const { EntityNotExistError } = require('../utils/errors/commonError');
const { NotEnoughBalanceError } = require('../utils/errors/transactionError');
const logger = require('../utils/logger');
const logTag = 'src:transaction';
const transactions = require('./transactionServicePrepared');

//거래내역생성
//data.accountNumber
//data.type
//data.transactionAmount
//data.briefs
exports.createTransaction = async (data) => {
  //REPEATABLE_READ : 트랜잭션 중 다른 곳에서 수정 금지
  const t = await models.sequelize.transaction({
    isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
  });

  try {
    //계좌 잔액 조회
    const account = await models.account.findByPk(data.accountNumber, { 
      transaction:t,
      raw: true
    });
    if (account == undefined) throw new EntityNotExistError();

    let balance = account.balance;

    //출금 시 잔액부족 확인
    if (data.type == 1 && data.transactionAmount > balance) {
      throw new NotEnoughBalanceError();
    }

    //입출금에 맞게 잔액 값 설정
    switch (data.type) {
      case 0:
        balance = balance + data.transactionAmount; break;
      case 1:
        balance = balance - data.transactionAmount; break;
      default: throw ValidationError;
    }
    
    //계좌 잔액 변경
    const updateResult = await models.account.update({
      balance: balance
    }, {
      where: {
        accountNumber: data.accountNumber
      },
      transaction:t,
    });
    if(!updateResult)
      throw InternalServerError();

    //거래내역 생성
    let transaction = await models.transaction.create({
      accountNumber: data.accountNumber,
      transactionAmount: data.transactionAmount,
      briefs: data.briefs,
      transactionType: data.type,
      balance: balance
    }, { 
      transaction:t,
      raw: true 
    });
    //log //log logger.logWithTag("transaction : "+transaction, logTag);

    await t.commit();
    return transaction;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}


exports.checkAccountExists = async (account,userId) => {
  return models.account.count({
    where : {
      accountNumber: `${account}`,
      userId: `${userId}`
    }
      
  })
}

exports.readTransactionList = async (data) => {  
  /*
  *  accountNumber : ,
  *  begin : ,
  *  end : ,
  *  type : ,
  *  order : ,
  *  page : ,
  *  lastIndex : ,
  */
  return new Promise(async (resolve, reject) => {

      if(data.lastIndex && (data.lastIndex.order != data.order)){
          delete data.lastIndex
          
      }
      

      var query = transactions.prepares(data)
      try {
          let results = await models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT })
          let lastIndex = undefined
          if (results.length > 0){      
              
              lastIndex = {
                  page : data.page,
                  order : data.order,
                  type : data.type,
                  begin : data.begin,
                  end : data.end,
                  accountNumber : data.accountNumber,
                  value : results[results.length - 1].id               
              };
              
          }
          resolve({ results, lastIndex })

      } catch (err) {
          reject(err)
      }
  })


}
