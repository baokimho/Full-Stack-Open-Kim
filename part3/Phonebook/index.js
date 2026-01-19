require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const Person = require('./mongo.js')

// let data =
// [
//     {
//       "id": "1",
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": "2",
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": "3",
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": "4",
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     }
// ]

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// app.use(morgan("tiny"))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/persons', (req, res, next) => {

  if (!req.body.name || !req.body.number) {
    return res.status(400).json({ error: 'Content missing' })
  }

  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })

  person.save().then(savedP => {
    res.status(201).json(savedP)
  })
    .catch((e) => next(e))
})

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then( p => {
    res.status(200).json(p)
  })
    .catch((e) => next(e))
})

app.get('/info', (req, res, next) => {
  Person.find({}).then( p => {
    res.send(`Phonebook has info for ${p.length} people <br>${Date()}`)
  })
    .catch((e) => next(e))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(p => {
    if (!p){
      return res.status(404).end()
    }
    res.status(200).json(p)
  })
    .catch((e) => next(e))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((e) => next(e))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  Person.findByIdAndUpdate(req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(result => {
      if (result) {
        res.json(result)
      } else {
        res.status(404).end()
      }
    })
    .catch((e) => next(e))
})

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})