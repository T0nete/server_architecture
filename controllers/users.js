const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports.createUser = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body

    // Validations
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email and password' })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      bio,
    })
    console.log(user)
    res.status(201).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validations
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    // Check password
    const match = bcrypt.compareSync(password, user.password)
    if (!match) {
      return res.status(400).json({ error: 'Password is incorrect' })
    }

    // Create token
    const payload = { id: user._id, name: user.name }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

    res.status(200).json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
