const Post = require('../models/post')
const httpMocks = require('node-mocks-http')
const newPost = require('../mock-data/new-post.json')
const newInvalidTitlePost = require('../mock-data/new-invalid-title-post.json')
const newInvalidTextPost = require('../mock-data/new-invalid-text-post.json')
const newInvalidAttributePost = require('../mock-data/new-post-without-title.json')
const { createPost } = require('../controllers/posts')

jest.mock('../models/post')

let req, res, next

beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = null
})

describe('Post Controller Create', () => {
  beforeEach(() => {
    req.body = newPost
  })

  it('should have a createPost function', () => {
    expect(typeof createPost).toBe('function')
  })

  it('should call Post.create', () => {
    createPost(req, res, next)
    expect(Post.create).toBeCalledWith(newPost)
  })

  it('should return 201 response code', async () => {
    Post.create.mockReturnValue(newPost)
    await createPost(req, res, next)
    expect(res._getStatusCode()).toBe(201)
    const data = JSON.parse(res._getData())
    expect(data.title.length).toBeGreaterThan(5)
    expect(data.text.length).toBeGreaterThan(5)
    expect(data.author).toBe('Autor de prueba')
  })

  it('should return json body in response', async () => {
    Post.create.mockReturnValue(newPost)
    await createPost(req, res, next)
    expect(res._getJSONData()).toStrictEqual(newPost)
  })

  it('missing post attributes', async () => {
    req.body = newInvalidAttributePost
    await createPost(req, res, next)
    expect(res._getStatusCode()).toBe(400)
    expect(JSON.parse(res._getData())).toStrictEqual({ error: 'Please provide title, text and author' })
  })

  it('invalid tittle', async () => {
    req.body = newInvalidTitlePost
    await createPost(req, res, next)
    expect(res._getStatusCode()).toBe(400)
    expect(JSON.parse(res._getData())).toStrictEqual({ error: 'Title must be at least 5 characters long' })
  })

  it('invalid text', async () => {
    req.body = newInvalidTextPost
    await createPost(req, res, next)
    expect(res._getStatusCode()).toBe(400)
    expect(JSON.parse(res._getData())).toStrictEqual({ error: 'Text must be at least 5 characters long' })
  })
})
