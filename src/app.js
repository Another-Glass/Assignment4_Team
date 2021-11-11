const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

const { logger, resFormatter } = require('./utils');
const { statusCode, routes, responseMessage } = require('./globals');

const globalRouter = require('./routes/globalRouter');
const userRouter = require('./routes/userRouter');
const accountRouter = require('./routes/accountRouter');

const { NoPageError } = require('./utils/errors/commonError');

//서버 사전작업
const app = express();

// //뷰 엔진 및 에셋 위치 설정
// app.set('views', path.join(__dirname, 'public'));
// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);
// app.use(express.static(path.join(__dirname, 'public')));

//미들웨어 설정
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//라우터 설정
app.use(routes.root, globalRouter);
app.use(routes.user, userRouter);
app.use(routes.account, accountRouter);

// 아래는 에러 핸들링 함수들
app.use(function (req, res, next) {
  throw new NoPageError();
});

app.use(function (err, req, res, next) {
  let errCode = err.status || statusCode.INTERNAL_SERVER_ERROR;
  let message = errCode == statusCode.INTERNAL_SERVER_ERROR ? responseMessage.INTERNAL_SERVER_ERROR : err.message;

  if (req.app.get('env') == "development") logger.err(err);

  return res.status(errCode)
    .send(resFormatter.fail(message));
});

module.exports = app;
