const express = require('express')
const router = express.Router()
const users = require('../controllers/users')

// POST /api/users
router.post('/', users.createUser)

// POST /api/login
router.post('/login', users.login)

// PATCH /api/users/:id/confirm
router.patch('/:id/confirm', users.confirmAccount)
module.exports = router
