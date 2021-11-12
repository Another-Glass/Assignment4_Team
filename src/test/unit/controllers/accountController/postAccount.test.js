const httpMocks = require('node-mocks-http');
const accountController = require('../../../../controllers/accountController');
const accountService = require('../../../../services/accountService');
const postAccountDTO = require('../../../data/dto/postAccount.json');
const tokenDTO = require('../../../data/dto/token.json');
const { ValidationError } = require('../../../../utils/errors/commonError');

const encryption = require('../../../../libs/encryption');
const statusCode = require('../../../../globals/statusCode');

encryption.encrypt = jest.spyOn(encryption, 'encrypt');
encryption.makeSalt = jest.spyOn(encryption, 'makeSalt');
accountService.createAccount = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
})

describe('postAccount 단위 테스트', () => {
  beforeEach(() => {
    req.body = postAccountDTO;
    req.decoded = tokenDTO
  })

  it("accountController에 postAccount가 존재하는가?", () => {
    expect(typeof accountController.postAccount).toBe("function")
  })

  it("accountController의 postAccount에서 service의 createAccount를 호출하는가?", async () => {
    await accountController.postAccount(req, res, next);
    expect(accountService.createAccount).toBeCalled()
  })

  it("accountController의 postAccount에서 상태 코드를 201을 넘겨주는가?", async() => {
    await accountController.postAccount(req, res, next);
    expect(res.statusCode).toBe(statusCode.CREATED);
  })

  it("accountController의 postAccount에서 입력값이 제대로 들어오지 않는 경우 에러를 호출하는가?", async () => {
    req.body = {};
    const errorMessage = new ValidationError();
    await accountController.postAccount(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  })
})
