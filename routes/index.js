const express = require('express')
const router = express.Router()
const posts = require('./posts')
const users = require('./users')
const authenticate = require('../middlewares/authenticate')

router.use('/posts', authenticate, posts)
router.use('/users', users)

module.exports = router
