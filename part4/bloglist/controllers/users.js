const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const { response } = require('express')
const User = require('../models/user')
const { requestLogger } = require('../utils/middleware')

usersRouter.get('/', async (request, response) => {

    const users = await User.find({}).populate('blogs')
    
    response.status(200).json(users)

})

usersRouter.post('/', async (request, response) => {
    const {name, username, password} = request.body

    if (!password){
        return response.status(400).json({'error': 'password is required'})
    } else if(password.length < 3){
        return response.status(400).json({'error': 'password must be atleast 3 characters long'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User ({
        name,
        username,
        passwordHash,
        blogs : []
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)

    
})



module.exports = usersRouter