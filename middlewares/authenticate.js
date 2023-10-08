const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
  const token = req.headers.authorization
  console.log(token)
  if (!token) {
    return res.status(401).json({ error: 'Token not found' })
  }

  // Remove Bearer from string
  const tokenString = token.split(' ')[1]
  jwt.verify(tokenString, process.env.JWT_SECRET_KEY, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({ error: 'Token is invalid' })
    }
    req.user = decodedUser
    next()
  })
}

module.exports = authenticate
