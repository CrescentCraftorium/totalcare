const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const mongoose = require('mongoose')
const config = require('./config/database')

// Connect to MongoDB
mongoose.connect(config.database)

// Connection Log
mongoose.connection.on('connected', () => {
  console.log(`Connected to db: ${config.database}`)
})
mongoose.connection.on('error', (err) => {
  console.error(`DB Error: ${err}`)
})
mongoose.connection.on('open', () => {
  console.log(`Connection open: ${config.database}`)
})
mongoose.connection.on('close', () => {
  console.log(`Connection closed: ${config.database}`)
})

// Initialize Express Application
const app = express()

// Define Routes
const users = require('./routes/users')

// Server Port
const port = 1337

// CORS Middleware
app.use(cors())

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Body Parser Middleware
app.use(bodyParser.json())

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

app.use('/users', users)

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint')
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

// Start Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
