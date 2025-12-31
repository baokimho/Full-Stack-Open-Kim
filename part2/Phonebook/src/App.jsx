import { useState, useEffect } from 'react'
import Persons from './components/Person.jsx'
import PersonForm from './components/PersonForm.jsx'
import Filter from './components/Filter.jsx'
import axios from 'axios'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() =>{
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  },[])

  const handleSubmit = (e) =>{
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      e.preventDefault()
      return
    }
    e.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
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
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App