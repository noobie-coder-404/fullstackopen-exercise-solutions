const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
      type: String, 
      required: [true, 'username is required'],
      minlength: [3, 'username must be atlest 3 characters long'],
      unique: true
    },
    name: {
      type: String,
      required: [true, 'name is required']
    },
    passwordHash : String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v

    }
  })
  

module.exports = mongoose.model('User', userSchema)