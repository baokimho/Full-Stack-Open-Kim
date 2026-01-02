import React from 'react'

const Persons = ({ personsToShow, handleDelete}) => {
  return (
    <>{personsToShow.map(person => <p key={person.name}>{person.name}: {person.number}  <button onClick={() => handleDelete(person.id)}>Delete</button></p>)}</>
  )
}

export default Persons