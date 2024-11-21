config = require('./utils/config')

//app
const express = require('express')
const app = express()

//express async errors (to be imported before routes are imported)
require('express-async-errors')

//cors
const cors = require('cors')

//middleware
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')





//mongoose connection
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URL).then(() => console.log('connected to mongodb'))
.catch(error => console.log('error occured', error))




//app.use 

app.use(cors())

app.use(express.json())

//middleware
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter) //route handler
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app