const express = require('express')
const app = express()
const blogsRouter = require('./controllers/BlogController')
const usersRouter = require('./controllers/UserController')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middlewares = require('./utils/middlewares')
const loginRouter = require('./controllers/login')

const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl, { family: 4 })
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middlewares.errorHandler)

const PORT = config.PORT

module.exports = app