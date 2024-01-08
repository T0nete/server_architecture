const express = require('express')
const router = express.Router()
const posts = require('../controllers/posts')
const authenticate = require('../middlewares/authenticate')

// GET /api/posts
router.get('/', posts.listPosts)

// GET /api/posts/:id
router.get('/:id', posts.getPostById)

// POST /api/posts
router.post('/', posts.createPost)

// PATCH /api/posts/:id
router.patch('/:id', posts.updatePostById)

// DELETE /api/posts/:id
router.delete('/:id', posts.deletePostById)

module.exports = router
