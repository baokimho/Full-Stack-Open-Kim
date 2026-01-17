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

app.post('/api/persons', (req, res) => {

  if (!req.body.name || !req.body.number) {
    return res.status(400).json({ error: "Content missing"})
  }

  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })
  
  person.save().then(savedP =>{
    res.status(201).json(savedP)
  })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then( p => {
      res.status(200).json(p)
    })
})

app.get('/info', (req, res) => {
    Person.find({}).then( p => {
      res.send(`Phonebook has info for ${p.length} people <br>${Date()}`)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(p => {
      if (!p){
        return res.status(404).end()
      }
      res.status(200).json(p)
    }) 
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})