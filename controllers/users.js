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

    // Send email to confirm account and set active to true

    // Create transporter
    // try {
    //   const transporter = nodeMailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: process.env.EMAIL_USERNAME,
    //       pass: process.env.EMAIL_PASSWORD,
    //     },
    //   })

    //   console.log(transporter)

    //   // Create email
    //   const emailOptions = {
    //     from: process.env.EMAIL_USERNAME,
    //     to: user.email,
    //     subject: 'Confirm your account',
    //     text: 'Please confirm your account',
    //     html: `<a href="http://localhost:3000/confirm/${user._id}">Confirm your account</a>`,
    //   }

    //   console.log(emailOptions)

    //   // Send email
    //   transporter.sendMail(emailOptions, (err, info) => {
    //     if (err) {
    //       console.error(err)
    //       res.status(500).json({ error: 'Something went wrong' })
    //       return
    //     }
    //     console.log(info)
    //   })
    // } catch (error) {
    //   console.error(error)
    // }

    res
      .status(201)
      .json(`<a href="http://localhost:${process.env.PORT}/api/users/${user._id}/confirm">Confirm your account</a>`)
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

    // Validate if user is active
    if (!user.active) {
      return res.status(400).json({ error: 'Please confirm your account' })
    }

    // Check password
    const passwordMatches = bcrypt.compareSync(password, user.password)
    if (!passwordMatches) {
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

module.exports.confirmAccount = async (req, res) => {
  try {
    const { id } = req.params

    // Update user active to true
    const user = await User.findByIdAndUpdate(id, { active: true }, { new: true })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error(error)
  }
}
