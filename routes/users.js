const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../config/database')

// Get Users
router.post('/userlist', (req, res, next) => {
  User.getUserList((err, users) => {
    if (err) console.error(err)
    if (!users) return res.json({success: false, msg: 'No users found'})
    res.json({success: true, users: users})
  })
})

// Register Route
router.post('/register', (req, res, next) => {
  let newUser = new User({
    'name': req.body.name,
    'email': req.body.email,
    'username': req.body.username,
    'password': req.body.password
  })

  User.addUser(newUser, (err, user) => {
    if (err) res.json({success: false, msg: 'Failed to register user'})
    res.json({success: true, msg: 'User registered'})
  })
})

// Authentication Route
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  User.getUserByUsername(username, (err, user) => {
    if (err) console.error(err)
    if (!user) {
      return res.json({success: false, msg: 'User not found'})
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) console.error(err)
      if (isMatch) {
        const token = jwt.sign(user, config.secret, {
          expiresIn: '24h'
        })

        res.json({
          success: true,
          token: `JWT ${token}`,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role
          }
        })
      } else {
        return res.json({success: false, msg: 'Incorrect Username or Password'})
      }
    })
  })
})

// Profile Route
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user})
})

// Validation Route
router.get('/validate', (req, res, next) => {
  res.send('Validate')
})

module.exports = router
