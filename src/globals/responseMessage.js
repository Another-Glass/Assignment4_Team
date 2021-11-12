//응답 메시지 모음

module.exports = {
  SUCCESS: 'Request 성공',
  NULL_VALUE: '필요한 값이 없거나 잘못되었습니다.',
  OUT_OF_VALUE: '파라미터 값이 잘못되었습니다.',
  WRONG_INDEX: '잘못된 인덱스 접근입니다.',
  DB_ERROR: 'DB 오류',
  INTERNAL_SERVER_ERROR: '서버 오류입니다.',
  DUPLICATE_ERROR: '중복된 요청입니다.',
  PERMISSION_ERROR: '권한이 없습니다.',
  ENTITY_NOT_EXIST: "DB에 없는 데이터 관련 요청입니다.",
  NO_PAGE_ERROR: "해당 라우트는 존재하지 않습니다.",

  // token
  EMPTY_TOKEN: '토큰 값이 없습니다.',
  EXPIRED_TOKEN: '토큰 값이 만료되었습니다.',
  INVALID_TOKEN: '유효하지 않은 토큰값입니다.',
  AUTH_SUCCESS: '인증에 성공했습니다.',
  ISSUE_SUCCESS: '새로운 토큰이 생성되었습니다.',

  // 회원가입
  CREATED_USER: '회원 가입 성공',
  ALREADY_EMAIL: '이미 사용중인 이메일입니다.',
  AVAILABLE_USERNAME: '사용 가능한 아이디입니다.',
  SUCCESS_SNS_CHECK: '가입되어 있는 계정입니다.',
  FAIL_SNS_CHECK: '가입되어 있지 않은 계정입니다.',
  //FAIL_SINGUP: '회원 가입 실패',

  // 로그인
  LOGIN_SUCCESS: '로그인 성공',

  //LOGIN_FAIL: '로그인 실패',
  LOGOUT_SUCCESS: '로그아웃 성공',
  NO_USER: '존재하지 않는 회원입니다.',
  MISS_MATCH_PW: '비밀번호가 맞지 않습니다.',

  //입금/출금
  DEPOSIT_SUCCESS: "입금 성공",
  WITHDRAW_SUCCESS: "출금 성공",
  NOT_ENOUGH_BALANCE: "잔액이 부족합니다",

  // account
  ACCOUNT_CREATED: "계좌 생성 성공",

  //거래 내역
  TRANSACTIONS_FOUND: '거래내역을 찾았습니다.',
  ACCOUNT_NOT_FOUND: '명의와 일치하는 계좌가 없습니다.',
};