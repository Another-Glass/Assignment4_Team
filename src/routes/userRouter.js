const express = require("express");
const routes = require('../globals/routes');

const userController = require('../controllers/userController.js');

const userRouter = express.Router();

//유저생성
userRouter.post(routes.root, userController.postUser);

//로그인
userRouter.post(routes.token, userController.postToken);

//로그인
userRouter.get(routes.token, userController.getTokenPage);

module.exports = userRouter;