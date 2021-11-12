const httpMocks = require('node-mocks-http');

const transactionController = require('../../../../controllers/transactionController');
const transactionService = require('../../../../services/transactionService');
const statusCode = require('../../../../globals/statusCode');
const tokenDTO = require('../../../data/dto/token.json');

transactionService.checkAccountExists = jest.fn();
transactionService.readTransactionList = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
})

describe('getTransaction 단위 테스트', () => {
  beforeEach(() => {
    req.decoded = tokenDTO
    req.params = '37175d2a-7d88-4d13-9c4e-ef2dc1714c33';
  })

  it("transactionController에 getTransaction이 존재하는가?", () => {
    expect(typeof transactionController.getTransaction).toBe("function")
  })

  it("transactionController의 getTransaction에서 service의 checkAccountExists를 호출하는가?", async () => {
    await transactionController.getTransaction(req, res, next);
    expect(transactionService.checkAccountExists).toBeCalled()
  })

  it("transactionController의 getTransaction에서 service의 readTransactionList를 호출하는가?", async () => {
    transactionService.checkAccountExists.mockReturnValue(2)
    await transactionController.getTransaction(req, res, next);
    expect(transactionService.readTransactionList).toBeCalled()
  })

  it("transactionController의 getTransaction에서 상태 코드를 200을 넘겨주는가?", async () => {
    transactionService.readTransactionList.mockReturnValue({ results: [], lastIndex: undefined });
    await transactionController.getTransaction(req, res, next);
    expect(res.statusCode).toBe(statusCode.OK);
  })
})
