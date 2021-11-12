const httpMocks = require('node-mocks-http');

const transactionController = require('../../../../controllers/transactionController');
const accountService = require('../../../../services/accountService');
const transactionService = require('../../../../services/transactionService');

const tokenDTO = require('../../../data/dto/token.json');

const { ValidationError } = require('../../../../utils/errors/commonError');
const { PasswordMissMatchError } = require('../../../../utils/errors/userError');

const encryption = require('../../../../libs/encryption');

accountService.readAccountPassword = jest.fn();
transactionService.createTransaction = jest.fn();
encryption.makeSalt = jest.spyOn(encryption, 'makeSalt');
encryption.encrypt = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
})

describe('postTransaction 단위 테스트', () => {
  beforeEach(() => {
    req.decoded = tokenDTO
    req.params = '37175d2a-7d88-4d13-9c4e-ef2dc1714c33';
  })

  it("transactionController에 postTransaction이 존재하는가?", () => {
    expect(typeof transactionController.postTransaction).toBe("function")
  })

  it("transactionController의 postTransaction에서 service의 readAccountPassword를 호출하는가?", async () => {
    await transactionController.postTransaction(req, res, next);
    expect(accountService.readAccountPassword).toBeCalled()
  })

  it("transactionController의 postTransaction에서 비밀번호가 일치하지 않는 경우 에러를 호출하는가?", async () => {
    const errorMessage = new PasswordMissMatchError();
    const rejectedPromise = Promise.reject(errorMessage);
    accountService.readAccountPassword.mockReturnValue(rejectedPromise);
    await transactionController.postTransaction(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  })

  it("transactionController의 postTransaction에서 service의 readAccountPassword를 호출하는가?", async () => {
    await transactionController.postTransaction(req, res, next);
    expect(accountService.readAccountPassword).toBeCalled()
  })
  
  it("transactionController의 postTransaction에서 입력값이 제대로 들어오지 않는 경우 에러를 호출하는가?", async () => {
    const errorMessage = new ValidationError();
    accountService.readAccountPassword.mockResolvedValue(true);
    await transactionController.postTransaction(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  })
})
