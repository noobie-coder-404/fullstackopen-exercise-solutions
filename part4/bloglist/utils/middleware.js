const user = require('../models/user')
const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  
  
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer')){
    request.token = authorization.replace('Bearer ', '')
    
  } else {
    request.token = null
  }
  
  
  
  
  next()
}

const userExtractor = (request, response, next) => {
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET) //throws an error if token is not a valid token and the error is caught by the errorHandler middleware
  
  request.user = decodedToken
  
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'username must be unique' })
  } else if (error.name === 'JsonWebTokenError'){
    return response.status(401).json({error: "invalid token"})
  } 

   
    
  

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor,
  tokenExtractor
}