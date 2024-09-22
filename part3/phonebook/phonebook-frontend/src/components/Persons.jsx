import Person from "./Person"

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
export default Persons