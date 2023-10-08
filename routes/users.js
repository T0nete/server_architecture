const express = require('express')
const router = express.Router()
const users = require('../controllers/users')

// POST /api/users
router.post('/', users.createUser)

// POST /api/login
router.post('/login', users.login)

module.exports = router
