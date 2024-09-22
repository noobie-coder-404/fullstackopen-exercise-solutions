import { useState, useEffect } from 'react'
import phonebookServices from './services/phonebook'

const {create, getAll, remove, replace} = phonebookServices

import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'




const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setNewSearch] = useState('')
  const [notification, setNotification] = useState({})

  useEffect(()=> {
    getAll()
      .then (response => {
        console.log(response)
        setPersons(response.data)
      }
        
      )
  }, [])

 const baseUrl = 'http://localhost:3001/persons'


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const addNewPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName.trim(),
      number: newNumber.trim()
    }
    if (personObject.name === '' || personObject.number === '') {
      setNotification({notificationMessage : 'Name or number fields can\'t be empty', wasSuccessful : false})
      setTimeout(() => {
        setNotification({})
        }, 3000)

      //following code so that the field doesn't become empty again after pressing the button and user can continue typing without having to retype everything
      setNewName(personObject.name)
      setNewNumber(personObject.number)
        
    }
    else {
      let personToBeReplaced //declared outside because you can't declare variable inside an if statement's condition, only assignment can be done inside the condition statement
      if (personToBeReplaced = persons.find(person => person.name === personObject.name)) { //in case person already exists (assignment done in the condition statement so that the variable personToBeReplaced becomes availabe inside the if block)
       
        replace(personToBeReplaced.id, personObject).then( response => {
          console.log(response.data, 'added')
          setNotification({notificationMessage : `Updated ${response.data.name}`, wasSuccessful : true})
          setTimeout (() => {
            setNotification({})
            }, 3000)
          setPersons(persons.map(person => 
           person.id === response.data.id ? response.data : person // replaces the old number with new number
          )
        )
        }
        ).catch(error => {
          setNotification({notificationMessage: error.response.data.error, wasSuccessful: false})
          setTimeout (() => {
            setNotification({})
            }, 3000)
          //following code so that the field doesn't become empty again after pressing the button and user can continue typing without having to retype everything
          setNewName(personObject.name)
          setNewNumber(personObject.number)
        })
        
      } 
      
      else {
        create(personObject).then( response => {
          
          setNotification({notificationMessage : `Added ${response.data.name}`, wasSuccessful : true})
          setTimeout (() => {
            setNotification({})
            }, 3000)
          setPersons(persons.concat(response.data))
        }
        ).catch(error => {
          setNotification({notificationMessage: error.response.data.error, wasSuccessful: false})
          setTimeout (() => {
            setNotification({})
            }, 3000)
            //following code so that the field doesn't become empty again after pressing the button and user can continue typing without having to retype everything
          setNewName(personObject.name)
          setNewNumber(personObject.number)
        })
  
        
      
      } 

      setNewName('')
      setNewNumber('')

    }
    
  
   
  }
  
  // removePerson is a function that returns another function
  // we are returning an anonymous function inside removePerson but we could also have named it 
  // and then used 'return name' to return it, like the course examples show in part1-d section 'A function that returns a function'
  const removePerson = (id) => {
    
    
      return () => {
        
        if (window.confirm(`Delete ${persons.filter(person => person.id === id)[0].name} ?`)) {
          remove(id).then(response => {
            setPersons(persons.filter( person =>
              person.id !== id
            ))
            setNotification({notificationMessage: `Removed ${response.data.name}`, wasSuccessful: true})
            setTimeout (() => {
            setNotification({})
            }, 3000)
          })
        }
        
      }
    
  }





  return (
    <div>
      <h2>Phonebook</h2>
      < Notification notificationMessage = {notification.notificationMessage} wasSuccessful = {notification.wasSuccessful}/>
      < Filter onChange = {handleSearchChange} search ={search}/>
      <h2>Add new</h2>
      < PersonForm onSubmit = {addNewPerson} onNameChange = {handleNameChange} onNumberChange = {handleNumberChange} newName = {newName} newNumber = {newNumber}/>
      
      <h2>Numbers</h2>
      < Persons persons = {persons} search = {search} removePerson = {removePerson}/>
      
    </div>
  )
}

export default App