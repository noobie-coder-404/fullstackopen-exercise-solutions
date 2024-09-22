require('dotenv').config()

const express = require('express')

const morgan = require('morgan')
morgan.token('req-data', (request) => JSON.stringify(request.body))

const app  = express()
app.use(express.json())

const Person = require('./models/person')

const cors = require('cors')
app.use(cors())

// app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-data'))

app.use(express.static('dist'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get( '/info', (request,response,next) => {

  Person.find({}).then( result => {
    const now = new Date()
    const numberOfPeople = result.length
    response.status(200).send(
      `<p>Phonebook has info for ${numberOfPeople} people </p>
         <p> ${now.toString()} </p>`
    )
  }).catch(error => next(error))
})


app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
    response.status(200).json(result)
  }).catch(error => next(error))
})


app.get('/api/persons/:id', (request,response,next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person){
      response.status(200).json(person)
    } else {
      response.status(404).json({ error: 'No record found' }).end()
    }
  }).catch(error => next(error))



})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {

    if (result) {
      response.status(200).json(result)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {


  const newPerson = request.body

  if (!newPerson.name ) {
    response.status(400)
    response.json({ error: 'no name' })
  } else if (!newPerson.number) {
    response.status(400)
    response.json({ error: 'no number' })
  } else {


    const person = new Person({
      name: newPerson.name,
      number: newPerson.number,
    })

    person.save().then(savedPerson => {
      response.status(201).json(savedPerson)
    }).catch(error => next(error))
  }




})

app.put('/api/persons/:id', (request,response, next) => {
  const id = request.params.id

  Person.findById(id).then(result => {

    const person = ({
      name: result.name, // request might have a different name if the user is malicious, so we cannot use the name provided by the request and hence use the name we already have and get as a result of the query
      number: request.body.number
    })

    Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' }).then(updatedNote =>
      response.status(200).json(updatedNote)
    ).catch(error => next(error))

  }
  ).catch(error => next(error))

})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'wrongly formatted id' })
  } else if (error.name === 'ValidationError') {
    // console.log('\nFOLLOWING VALIDATION ERROR OCCURED: \n\n', error)

    let errorMessage = 'Error: '
    for (const key in error.errors){
      errorMessage = errorMessage + error.errors[key].message + ' and '
    }
    errorMessage = errorMessage.slice(0, -4)
    console.log(errorMessage)

    return response.status(400).json({ error: errorMessage })
  } else if (error.code === 11000) {
    return  response.status(409).json({ error: 'Name already exists' })
  }

  //return statements were used while sending the responses so that the execution stops and the following (next(error) function) doesn't get executed. Return statements were not used anywhere in route handler functions when sending responses
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})