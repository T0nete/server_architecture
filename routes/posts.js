const express = require('express');
const router = express.Router();
const posts = require('../controllers/posts');

// GET /api/posts
router.get('/posts', posts.index);

// GET /api/posts/:id
router.get('/posts/:id', posts.show);

// POST /api/posts
router.post('/posts', posts.create);

// PATCH /api/posts/:id
router.patch('/posts/:id', posts.update);

// DELETE /api/posts/:id
router.delete('/posts/:id', posts.destroy);