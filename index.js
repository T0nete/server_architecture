const express = require('express')
const helmet = require('helmet')
const csrf = require('csurf')

const app = express()

app.use(helmet())
app.use(csrf())

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
