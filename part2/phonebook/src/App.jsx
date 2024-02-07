import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="message">
      {message}
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with <input value={props.filter} onChange={props.onFilterChange}/>
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addName}>
      <div>
        name: <input value={props.newName} onChange={props.onNameChange} />
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({person, onDelete}) => {
  return (
    <tr>
      <td>{person.name}</td>
      <td>{person.number}</td>
      <td>
        <button onClick={(event) => onDelete(event, person)}>delete</button>
      </td>
    </tr>
  ) 
}

const Persons = ({persons, onDelete}) => {
  return (
    <table>
      <tbody>
        {persons.map(person =>
      <Person 
        key={person.id} 
        person={person}
        onDelete={onDelete}
      />)}
      </tbody>
    </table>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const newId = `${persons.length + 1}`
    const newPerson = {id: newId, name: newName, number: newNumber}
    
    if (persons.some(item => areNamesEqual(newPerson.name, item.name))) {
      if (confirm(`${newPerson.name} is already added to the phonebook, replace the old
      number with a new one?`)) {
        const updated = updateNumber(newPerson.name, newPerson.number)
      } 
    } else {
      personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        console.log("Added ", newPerson)
        setMessage(`Added ${newPerson.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    }
    
  }

  const updateNumber = (name, newNumber) => {  
    const match = persons.find(item => areNamesEqual(item.name, name))
    const updatedPerson = {...match, number: newNumber}
    personService
    .replaceNumber(updatedPerson.id, updatedPerson)
    .then(updated => {
      setPersons(persons.map(item => item.id !== updated.id ? item : updated))
      setNewName('')
      setNewNumber('')
      console.log("Updated", updated)
      setMessage(`Changed ${updatedPerson.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
  }

  const areNamesEqual = (name1, name2) => {
    return JSON.stringify(name1) === JSON.stringify(name2)
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
    //console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleDelete = (event, person) => {
    event.preventDefault()
    if (confirm(`Delete ${person.name}?`)) {
      personService
      .remove(person.id)
      .then(deleted => {
        setPersons(persons.filter(item => item.id !== deleted.id))
        console.log("Deleted", deleted);
      })
      .catch(error => {
        console.log('Deletion failed:', error)
      })
    }
  }

  const filtered = filter === '' 
  ? persons 
  : persons.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h1>Phonebook</h1>
      
      <Notification message={message} />

      <Filter filter={filter} onFilterChange={handleFilterChange} />
      
      <h3>Add new</h3>
      
      <PersonForm
        addName={addName}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>

      <Persons persons={filtered} onDelete={handleDelete}/>
    </div>
  )
}

export default App