const jwt = require('jsonwebtoken')
const httpMocks = require('node-mocks-http')
const authenticate = require('../middlewares/authenticate')

jest.mock('jsonwebtoken')

let req, res, next

beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = jest.fn()
})

describe('Authenticate Middleware', () => {
  it('should return 401 if token is not found', () => {
    authenticate(req, res, next)
    expect(res._getStatusCode()).toBe(401)
    expect(res._getJSONData()).toMatchObject({ error: 'Token not found' })
  })

  it('should call jwt.verify with the token from the headers', () => {
    req.headers.authorization = 'Bearer token'
    authenticate(req, res, next)
    expect(jwt.verify).toBeCalledWith('token', process.env.JWT_SECRET_KEY, expect.any(Function))
  })

  it('should return 401 if token is invalid', () => {
    req.headers.authorization = 'Bearer token'
    jwt.verify.mockImplementationOnce((token, secret, cb) => cb(true))
    authenticate(req, res, next)
    expect(res._getStatusCode()).toBe(401)
    expect(res._getJSONData()).toMatchObject({ error: 'Token is invalid' })
  })

  it('should call next if token is valid', () => {
    req.headers.authorization = 'Bearer token'
    const decodedUser = { id: 'userId' }
    jwt.verify.mockImplementationOnce((token, secret, cb) => cb(false, decodedUser))
    authenticate(req, res, next)
    expect(req.user).toBe(decodedUser)
    expect(next).toBeCalled()
  })
})
