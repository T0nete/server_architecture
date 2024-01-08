const express = require('express')
const helmet = require('helmet')
const csrf = require('csurf')
const rateLimit = require('express-rate-limit')

const app = express()

app.use(helmet())
app.use(csrf())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de solicitudes por IP
})
app.use(limiter)

require('dotenv').config()
const port = process.env.PORT || 8000

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Set up database
const dbConfig = require('./config/db.config')
dbConfig()

// Add routes
const routes = require('./routes/index')
app.use('/api', routes)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
