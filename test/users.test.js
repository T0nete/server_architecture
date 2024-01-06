const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const httpMocks = require('node-mocks-http')
const { login } = require('../controllers/users')

jest.mock('bcrypt')
jest.mock('jsonwebtoken')
jest.mock('../models/user')

let req, res, next

beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = jest.fn()
})

describe('Login', () => {
  it('should return 400 if email or password is not provided', async () => {
    await login(req, res, next)
    expect(res._getStatusCode()).toBe(400)
    expect(res._getJSONData()).toMatchObject({ error: 'Please provide email and password' })
  })

  it('should return 400 if user is not found', async () => {
    req.body = { email: 'test@test.com', password: 'password' }
    User.findOne.mockResolvedValue(null)

    await login(req, res, next)
    expect(res._getStatusCode()).toBe(400)
    expect(res._getJSONData()).toMatchObject({ error: 'User not found' })
  })

  it('should return 400 if user is not active', async () => {
    req.body = { email: 'test@test.com', password: 'password' }
    User.findOne.mockResolvedValue({ email: 'test@test.com', password: 'hashedPassword', active: false })
    bcrypt.compareSync.mockReturnValue(true)

    await login(req, res, next)
    expect(res._getStatusCode()).toBe(400)
    expect(res._getJSONData()).toMatchObject({ error: 'Please confirm your account' })
  })

  it('should return 400 if password is incorrect', async () => {
    req.body = { email: 'test@test.com', password: 'password' }
    User.findOne.mockResolvedValue({ email: 'test@test.com', password: 'hashedPassword', active: true })
    bcrypt.compareSync.mockReturnValue(false)

    await login(req, res, next)
    expect(res._getStatusCode()).toBe(400)
    expect(res._getJSONData()).toMatchObject({ error: 'Password is incorrect' })
  })

  it('should return 200 and a token if login is successful', async () => {
    req.body = { email: 'test@test.com', password: 'password' }
    User.findOne.mockResolvedValue({ email: 'test@test.com', password: 'hashedPassword', active: true })
    bcrypt.compareSync.mockReturnValue(true)
    jwt.sign.mockReturnValue('token')

    await login(req, res, next)
    expect(res._getStatusCode()).toBe(200)
    expect(res._getJSONData()).toMatchObject({ token: 'token' })
  })
})
