require('dotenv').config()

const mongoose = require('mongoose')


let url = process.env.MONGODB_URI


if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit()
}

const password = process.argv[2]

const colonSplit = url.split(':')
const atSplit = colonSplit[2].split('@')
url = colonSplit[0] + ':' + colonSplit[1] + ':' + password + '@' + atSplit[1]




mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => console.log('connected successfully to database')).catch(error => console.log(error))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3){
  Person.find({}).then(result => {
    result.forEach(person => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close()
  })
} else if (process.argv.length > 5) {
  console.log('too many arguments')
  process.exit()
}
else {

  const person = new Person({
    name: process.argv[3].trim(),
    number: process.argv[4].trim(),
  })


  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number}`)
    mongoose.connection.close()
  })
}
