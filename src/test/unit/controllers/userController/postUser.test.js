const httpMocks = require('node-mocks-http');
const userController = require('../../../../controllers/userController');
const userService = require('../../../../services/userService');
const signupData = require('../../../data/dto/signup.json');
const { ValidationError } = require('../../../../utils/errors/commonError');
const { DuplicatedError } = require('../../../../utils/errors/userError');

const statusCode = require('../../../../globals/statusCode');

userService.checkUser = jest.fn();
userService.signup = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('signup 단위 테스트', () => {
  beforeEach(() => {
    req.body = signupData;
  });

  it('userController에 postUser가 존재하는가?', () => {
    expect(typeof userController.postUser).toBe('function');
  });

  it('userController의 postUser에서 service의 checkUser를 호출하는가?', async () => {
    await userController.postUser(req, res, next);
    expect(userService.checkUser).toBeCalled();
  });

  it('userController의 postUser에서 service의 checkUser에 인자값을 넣어서 호출하는가?', async () => {
    await userController.postUser(req, res, next);
    expect(userService.checkUser).toBeCalledWith(req.body.userId);
  });

  it('userController의 postUser에서 service의 signup을 호출하는가?', async () => {
    await userController.postUser(req, res, next);
    expect(userService.signup).toBeCalled();
  });

  it('userController의 postUser에서 상태 코드를 201을 넘겨주는가?', async () => {
    await userController.postUser(req, res, next);
    expect(res.statusCode).toBe(statusCode.CREATED);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('userController의 postUser에서 이름이 중복된 경우 에러를 호출하는가?', async () => {
    const errorMessage = new DuplicatedError();
    userService.checkUser.mockReturnValue(errorMessage);
    await userController.postUser(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  it('userController의 postUser에서 입력값이 제대로 들어오지 않는 경우 에러를 호출하는가?', async () => {
    req.body = { userId: 'test' };
    const errorMessage = new ValidationError();
    await userController.postUser(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
