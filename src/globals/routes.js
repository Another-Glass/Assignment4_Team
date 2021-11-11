//경로 변수들 모음

// Root
const ROOT = '/';

// User
const USER_SIGNUP = '/user';
const USER_SIGNIN = '/token';

const ACCOUNT = '/accounts';
const ACCOUNT_DETAIL = '/:accountNumber';

const TRANSACTION = '/transactions';


const routes = {
  root: ROOT,
  user: USER_SIGNUP,
  token: USER_SIGNIN,
  account: ACCOUNT,
  accountDetail: ACCOUNT_DETAIL,
  transaction: TRANSACTION,
}

module.exports = routes;



