const httpMocks = require('node-mocks-http');
const userController = require('../../../../controllers/userController');
const userService = require('../../../../services/userService');
const signupData = require('../../../data/dto/signup.json');
const { ValidationError } = require('../../../../utils/errors/commonError');
const { NotMatchedUserError, PasswordMissMatchError } = require('../../../../utils/errors/userError');

const encryption = require('../../../../libs/encryption');
const statusCode = require('../../../../globals/statusCode');

userService.checkUser = jest.fn();
userService.signin = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
})

describe('postToken 단위 테스트', () => {
  beforeEach(() => {
    req.body = signupData;
  })

  it("userController에 postToken이 존재하는가?", () => {
    expect(typeof userController.postToken).toBe("function")
  })

  it("userController의 postToken에서 service의 checkUser를 호출하는가?", async () => {
    await userController.postToken(req, res, next);
    expect(userService.checkUser).toBeCalled()
  })

  it("userController의 postToken에서 service의 checkUser에 인자값을 넣어서 호출하는가?", async () => {
    await userController.postToken(req, res, next);
    expect(userService.checkUser).toBeCalledWith(req.body.userId);
  })

  it("userController의 postToken에서 상태 코드를 200을 넘겨주는가?", async() => {
    await userController.postToken(req, res, next);
    expect(res.statusCode).toBe(statusCode.OK);
  })
  
  it("userController의 postToken에서 회원가입 하지 않은 이름을 입력한 경우 에러를 호출하는가?", async () => {
    req.body = { "userId": '1', "password": '1' };
    const errorMessage = new NotMatchedUserError();
    await userController.postToken(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  })

  it("userController의 postToken에서 비밀번호가 일치하지 않는 경우 에러를 호출하는가?", async () => {
    req.body = { "userId": "abc", "password": '1' };
    const salt = encryption.makeSalt();
    const inputPassword = encryption.encrypt(req.body.password, salt);
    userService.checkUser.mockReturnValue({salt, inputPassword});
    const errorMessage = new PasswordMissMatchError();
    await userController.postToken(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  })

  it("userController의 postToken에서 입력값이 제대로 들어오지 않는 경우 에러를 호출하는가?", async () => {
    req.body = { "userId": 'test' };
    const errorMessage = new ValidationError();
    await userController.postToken(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  })
})
