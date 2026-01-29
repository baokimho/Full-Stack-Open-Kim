const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    const saltRound = 10
    const passwordHash = await bcrypt.hash(password, saltRound)

    const user = new User({username, name, passwordHash})
    const savedUser = user.save()

    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

module.exports = usersRouter