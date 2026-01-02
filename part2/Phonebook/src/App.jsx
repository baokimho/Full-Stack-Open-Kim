import { useState, useEffect } from 'react'
import Persons from './components/Person.jsx'
import PersonForm from './components/PersonForm.jsx'
import Filter from './components/Filter.jsx'
import personService from './services/persons.js'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() =>{
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  },[])

  const handleSubmit = (e) =>{ 
    e.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      const confirmUpdate  = window.confirm(`${newName} exists, want to replace?`)
      
      if (confirmUpdate) {
        const changedPerson = {...existingPerson, number: newNumber}
        
        personService
          .update(existingPerson.id, changedPerson)
          .then(returnP=> {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnP ))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }
    personService.create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.delete(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  const personsToShow = filter 
      ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
      : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add a new</h2>
      <PersonForm 
        handleSubmit={handleSubmit} 
        newName={newName} 
        setNewName={setNewName} 
        newNumber={newNumber} 
        setNewNumber={setNewNumber} 
      />
      <h2>Numbers</h2>
      <Persons 
      personsToShow={personsToShow} 
      handleDelete={handleDelete}
      />
    </div>
  )
}

export default App