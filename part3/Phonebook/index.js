const express = require('express')
const app = express()

const data = 
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(data)
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${data.length} people <br>${Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = data.find(p => p.id === id)

    if (!person) {
        res.status(404).send(`The person with id ${id} doesn't exist!`)
        return 
    }
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})