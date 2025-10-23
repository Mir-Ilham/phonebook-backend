import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Persons from './components/Persons'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  const changeInputName = (event) => {
    setNewName(event.target.value)
  }

  const changeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const changeQuery = (event) => {
    setQuery(event.target.value)
  }

  useEffect(() => {
    personService
      .getAllPersons()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        alert('An error occured.')
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const match = persons.find(person => person.name === newName)

    if (match) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .updatePerson(match.id, {...match, number: newNumber})
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id == updatedPerson.id ? updatedPerson : person))
            
            setMessageType('success')
            setMessage(`${updatedPerson.name}'s number updated.`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            alert('An error occured.')
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .createPerson(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')

        setMessageType('success')
        setMessage(`${returnedPerson.name}'s number added.`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        alert('An error occured.')
      })
  }

  const deletePersonHandler = personId => {
    if (window.confirm("Do you want to delete this person entry?")) {
      personService
        .deletePerson(personId)
        .then(deletedPerson => {
          setMessageType('success')
          setMessage(`${deletedPerson.name}'s number deleted.`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessageType('error')
          setMessage(`${persons.find(person => person.id === personId).name}'s number already deleted from the server.`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })

        const newPersons = persons.filter(person =>
          person.id != personId
        )
        setPersons(newPersons)
    }
  }

  const personsToDisplay = persons.filter(person => {
    const cleanQuery = query.trim().toLowerCase()
    return person.name.toLowerCase().includes(cleanQuery)
  })

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Notification message={message} className={messageType} />

      <Filter query={query} changeQuery={changeQuery} />

      <h2>add a new</h2>

      <PersonForm addPerson={addPerson} newName={newName} changeInputName={changeInputName} newNumber={newNumber} changeNumber={changeNumber} />

      <h2>Numbers</h2>

      <Persons personsToDisplay={personsToDisplay} deletePersonHandler={deletePersonHandler} />

    </div>
  )
}

export default App