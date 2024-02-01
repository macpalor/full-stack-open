import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addName = (event) => {
    event.preventDefault()
    const person = {name: newName, number: newNumber}
    
    if (persons.some(item => areNamesEqual(person.name, item.name))) {
      alert(`${newName} is already added to the phonebook`)
    } else {
      setPersons(persons.concat(person))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const areNamesEqual = (name1, name2) => {
    return JSON.stringify(name1) === JSON.stringify(name2)
  }

  const showNumbers = (persons, filter) => {
    if (filter === '') {
      return (
        persons.map(person => <p key={person.name}>{person.name} {person.number}</p>)
      )
    } else {
      const filtered = persons.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
      return (
        filtered.map(person => <p key={person.name}>{person.name} {person.number}</p>)
      )
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={filter} onChange={handleFilterChange}/>
      </div>
      <h3>Add new</h3>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {/* {persons.map(person => <p key={person.name}>{person.name} {person.number}</p>)} */}
      {showNumbers(persons, filter)}
    </div>
  )
}

export default App