const express = require("express");
const routes = require('../globals/routes');

const accountController = require('../controllers/accountController.js');
const transactionController = require('../controllers/transactionController.js');
const auth = require('../middlewares/auth');

const accountRouter = express.Router();

//계좌 생성
accountRouter.post(routes.root, auth.checkToken, accountController.postAccount);

//로그인
accountRouter.post(routes.accountDetail+routes.transaction, transactionController.postTransaction);

//로그인
accountRouter.get(routes.accountDetail+routes.transaction, transactionController.getTransaction);

module.exports = accountRouter;