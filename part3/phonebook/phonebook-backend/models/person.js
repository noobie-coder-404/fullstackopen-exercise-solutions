const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const validation = require('validator')

const url = process.env.MONGODB_URI

console.log('connecting to MongoDB....')

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB:', error.message)
  })


const isNumeric = (number) => {
  const parts = number.split('-')
  let digits =''
  parts.forEach(part => {
    digits += part
  })
  if (validation.isNumeric(digits)) {
    return true
  }
  return false
}

const numberValidator = (number) => {
  const parts = number.split('-')


  if (parts.length !== 2) {
    return false
  } else if (parts[0].length > 3 || parts[0].length < 2 ) {
    return false
  } else {
    return true
  }
}



const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be atleast 3 characters long'],
    required: true,
    unique : true //in case someone sends a request without using the frontend ui (probably malicious) and request contains a duplicate name
  },
  number: {
    type: String,
    minLength: [8, 'Number must be atleast 8 characters long'],
    required: true,
    validate: [
      { validator: isNumeric, message: 'Number must contain only digits' },
      { validator: numberValidator, message: 'Number must have a single hyphen with part before hyphen having 2 or 3 digits (example: 040-223423 or 04-2342349)' }
    ]

  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)