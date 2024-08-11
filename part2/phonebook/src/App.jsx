import { useState, useEffect } from 'react'
import axios from 'axios'
import phonebookServices from './services/phonebook'

const {create, getAll, remove, replace} = phonebookServices

const Notification = ({notificationMessage, wasSuccessful}) => {
  if (!notificationMessage && !wasSuccessful) {
    return 
  }
  return (
    <div className = {wasSuccessful ? 'success' : 'error'}>
      {notificationMessage}
    </div>
  )
}
  

const Filter = ({onChange, search}) => <p>filter shown with: <input onChange = {onChange} value ={search}/></p>

const PersonForm = ({onSubmit, onNameChange, onNumberChange, newName, newNumber,}) => {
  return (
    <form onSubmit = {onSubmit}>
    
        <div>
          name: <input onChange = {onNameChange} value={newName} />
        </div>
        <div>
          number: <input onChange = {onNumberChange} value = {newNumber}/>
        </div>
        <div>
          <button type="submit" >add</button>
        </div>
  </form>
  )
}
  

const Person = ({name, number, removePerson, id}) => {
  return (
    <p>{name} {number} <button onClick = {removePerson(id)}>delete</button></p>
  )
}

    
    
  

const Persons = ({persons, search, removePerson}) => {
  return (
       //following code filters an array for names that have the search term in them and
       //then maps the output array to create html code that displays name and number
       // of the persons that are part of the output array
       // both name and search term are converted to lowercase for case insensitivity
       persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())).map(person =>
        <Person key={person.id} name = {person.name} number = {person.number} id={person.id} removePerson={removePerson} />
      )
  )
}



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setNewSearch] = useState('')
  const [notification, setNotification] = useState({})

  useEffect(()=> {
    getAll('http://localhost:3001/persons')
      .then (response =>
        setPersons(response.data)
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
    else if (!persons.find(person => person.name === personObject.name) && personObject.name !== '' && personObject.number !== '') {
      create(personObject).then( response => {
        console.log(response.data, 'added')
        setNotification({notificationMessage : `Added ${response.data.name}`, wasSuccessful : true})
        setTimeout (() => {
          setNotification({})
          }, 3000)
        setPersons(persons.concat(response.data))
      }
      )

      setNewName('')
      setNewNumber('')
    
    } 
  
    else {
      // alert(`${personObject.name} is already added to phonebook`)
      if (window.confirm(`${personObject.name} is already added, replace the old number with new one ?`)){
        
       console.log('entry to be replaced: ', persons.filter(person => 
        person.name === personObject.name
      )[0]) 
       
        replace(persons.filter(person => 
          person.name === personObject.name
        )[0].id, 
        personObject)
        .then(
          response => {
            console.log('entry replaced with: ', response.data)
            setNotification({notificationMessage : `Changed ${response.data.name}`, wasSuccessful : true})
            setTimeout (() => {
              setNotification({})
              }, 3000)

            setPersons(
              persons.map(person => {
                if (person.name === response.data.name) {
                  return {...person, number: response.data.number} //this was done to preserve id, because personObject doesn't have id, so we need to preserve the original id from the person object in persons array, while we simply replace person.number with new number
                } else {
                  return person
                }
              }
              )
            ) 
          }
          )
          .catch (error => { //incase the entry was deleted and the user tries to modify it
            setNotification({notificationMessage : `Information of ${personObject.name} was already deleted from the server`, wasSuccessful : false})
            setTimeout (() => {
              setNotification({})
              }, 3000)
            setPersons(persons.filter(person => person.name !== personObject.name))
          } 
          )   
    
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
        console.log('remove function executed')
        if (window.confirm(`Delete ${persons.filter(person => person.id === id)[0].name} ?`)) {
          remove(id).then(response => {
            console.log('delete request output : ', response)
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