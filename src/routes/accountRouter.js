const express = require("express");
const routes = require('../globals/routes');

const accountController = require('../controllers/accountController.js');
const transactionController = require('../controllers/transactionController.js');

const accountRouter = express.Router();

const {checkToken} = require("../middlewares/auth");

//유저생성
accountRouter.post(routes.root, checkToken, accountController.postAccount);

//입출금
accountRouter.post(routes.accountDetail+routes.transaction, checkToken, transactionController.postTransaction);

//입출금 내역조회
accountRouter.get(routes.accountDetail+routes.transaction, checkToken, transactionController.getTransaction);

module.exports = accountRouter;