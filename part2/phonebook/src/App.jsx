import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Filter from './components/Filter' 
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    //const newId = Number(persons.length + 1)
    //const newPerson = {id: newId, name: newName, number: newNumber}
    const newPerson = {name: newName, number: newNumber}

    if (persons.some(item => areNamesEqual(newPerson.name, item.name))) {
      if (confirm(`${newPerson.name} is already added to the phonebook, replace the old
      number with a new one?`)) {
        updateNumber(newPerson.name, newPerson.number)
      } 
    } else {
      personService
      .create(newPerson)
      .then(returnedPerson => {
        console.log("Added ", returnedPerson)
        setPersons(persons.concat(returnedPerson))
        setMessageType('success')
        setMessage(`Added ${returnedPerson.name}`)
      })
      .catch(error => {
        console.log("Error: ", error)
        setMessageType('error')
        setMessage(error.response.data.error.message)
      })
      .finally(() => {
        setNewName('')
        setNewNumber('')
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
      console.log("Updated", updated)
      setMessageType('success')
      setMessage(`Updated ${updatedPerson.name}`)
    })
    .catch(error => {
      console.log("Change failed: ", error)
      setMessageType('error')
      if (error.name === 'TypeError') {
        setPersons(persons.filter(item => item.id !== updatedPerson.id))
        setMessage(`Information of ${updatedPerson.name} has already been removed from the server`)
      } else if (error.response.data.error.name === "ValidationError") {
        setMessage(error.response.data.error.message)
      }
    })
    .finally(() => {
      setNewName('')
      setNewNumber('')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
  }

  const areNamesEqual = (name1, name2) => {
    return JSON.stringify(name1) === JSON.stringify(name2)
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDelete = (event, person) => {
    event.preventDefault()
    if (confirm(`Delete ${person.name}?`)) {
      personService
      .remove(person.id)
      .then(response => {
        setPersons(persons.filter(item => item.id !== person.id))
        setMessageType('success')
        setMessage(`Deleted ${person.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        console.log("Deleted", person)
      })
      .catch(error => {
        console.log('Deletion failed:', error)
        setMessageType('error')
        setMessage(`Information of ${person.name} has already been removed from the server`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.filter(item => item.id !== person.id))
      })
    }
  }

  const filtered = filter === '' 
  ? persons 
  : persons.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h1>Phonebook</h1>
      
      <Notification message={message} messageType={messageType} />

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