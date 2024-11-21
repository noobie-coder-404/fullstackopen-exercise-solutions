const { test, after, beforeEach, describe, before} = require('node:test')
const bcrypt = require('bcrypt')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const {blogs} = require('./sampleBlogs')
const Blog = require('../models/blog')

const User = require('../models/user')
const users = require('./sampleUsers')
const { json } = require('express')

const fakeIdGenerator = async () => {
  let tempBlog = new Blog({
    title: 'to be removed',
    url: 'to be removed'
  })
  const savedTempBlog = await tempBlog.save()
  const fakeId = savedTempBlog.id 
  await Blog.findByIdAndDelete(fakeId)

  return fakeId
}

const getAuthorizationHeader = async () => {
   //get token 
   let  response = await api.post('/api/login').send(users[0])
   const token = response.body.token
   return 'Bearer '+ token

}




beforeEach(async () => {


    await User.deleteMany({})

    for (let user of users) {
    saltRounds = 10
    user.passwordHash = await bcrypt.hash(user.password, saltRounds)
    const {password, ...newUser} = user
    const userObject = new User(newUser)
    await userObject.save()
  }

    await Blog.deleteMany({})

  
    for (let blog of blogs) {
      const {_id, __v, ...newBlog} = blog //destructuring to remove _id and __v fields as the db will create them by itself when saving
      const blogObject = new Blog(newBlog)
      await blogObject.save()
    }

    
    
  })

  describe('blogs are retrieved successfully', () => {

    test('correct amount of blogs is returned', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
        const returnedBlogs = await api.get('/api/blogs')
    
        assert.strictEqual(returnedBlogs.body.length, blogs.length)
    
    
    })
    
    test('id field exists', async () => {
        const returnedBlogs = await api.get('/api/blogs')
    
        returnedBlogs.body.forEach(blog =>
            assert(blog.hasOwnProperty('id'))
        )
    
    })
  })



describe('all users are returned successfully', () => {


  test('all users are returned successfully', async() => {

    const response = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, users.length)

    response.body.forEach(retrievedUser => {
      
      const {id, notes, blogs, ...realRetrievedUser} = retrievedUser

      const addedUser = users.find(user => user.username === realRetrievedUser.username)
      const {password, ...realAddedUser} = addedUser //remove the password from the user object that was sent to the server

      //now compare the user object that was sent and the one that has been received
      assert.deepStrictEqual(realRetrievedUser, realAddedUser)

     

    }
    )
   

  })


})

describe('new user is added successfully', ()=> {
  
  test('new user is added successfully', async () => {
    const userToAdd = {
      name: 'Johnny English',
      username: 'shooshan',
      password: 'susan'
    }

    await api.post('/api/users')
    .expect(201)
    .expect('Content-Type', /application\/json/)
    .send(userToAdd)

    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, users.length+1)

    const retrievedUsers = response.body

    const addedUser = retrievedUsers.find(retrievedUser => retrievedUser.username === userToAdd.username)
    const{id, notes, blogs, passwordHash, ...realAddedUser} = addedUser

    const {password, ...expectedUser} = userToAdd //remove password field from the user we originally added
    // immutable approach `delete userToAdd.password` could also be used


    assert.deepStrictEqual(realAddedUser, expectedUser) //check if username and name are same
    
    assert(bcrypt.compare(userToAdd.password, passwordHash)) //check if the password is same
    



  })

 


})

describe('tests for username and password restrictions pass', () => {

  //in case both username and password don't pass the restrictions, the server response will only have the message regarding
  //the password validation, not username. This is because the password is validated by the server but username is validated by the mongoose schema that the
  //server uses to send the password hash and other user details (without the password) to the mongodb. So, password validation happens before username validation, 
  //and username validation never happens if password validation fails, hence only the password validation error message is returned.
  // I have not written the test case where both username and password are missing and writing a test that checks for both
  //username validaiton error message as well as password validation error message for a single user cannot be written because the server simply doesn't return that message.

  test('both username and password are complusory', async () => {
    usersToAdd = [
      
      {
        username: 'jim234',
        name: 'Jim'
      },
      {
        name: 'Jim',
        password: 'passwordforjim'
      }
    ] 

    for (let userToAdd of usersToAdd){
      const response = await api.post('/api/users')
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .send(userToAdd)


      if (!userToAdd.username){
        assert(response.body.error.includes('username is required'))
      }

     
      if (!userToAdd.password){
        assert(response.body.error.includes('password is required'))
      }
    }
  
  })

  test('username and password must be atleast 3 characters long', async () => {

    usersToAdd = [
      {
        username: 'jm',
        password: 'passwordforjim',
        name: 'Jim'
      },
      {
        name: 'Jim',
        username: 'jim2342',
        password: 'pw'
      }
    ] 

    for (let userToAdd of usersToAdd){
      const response = await api.post('/api/users')
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .send(userToAdd)

      

      if (userToAdd.username.length < 3){
        assert(response.body.error.includes('username must be atlest 3 characters long'))
      }

      
      if (userToAdd.password.length < 3){
        assert(response.body.error.includes('password must be atleast 3 characters long'))
      }
    }
  

  })

  test('username must be unique', async () => {
    const firstUser = {
      name: 'Jim',
      username: 'jim',
      password: 'password'
    }

    await api.post('/api/users').send(firstUser)

    const secondUser = {
      name: 'Jim',
      username: 'jim',
      password: 'password'
    }

    response = await api.post('/api/users')
    .expect(400)
    .expect('Content-Type' , /application\/json/)
    .send(secondUser)

    assert(response.body.error.includes('username must be unique'))
  })

})

describe('users and blogs are found when retrieving either', () => {
  
  test('blogs contain the name and username of the user', async () => {
    await Blog.deleteMany({}) //to delete the blogs saved to the server using beforeEach function and instead saving them all using the server so that the user field gets created
    for (let blog of blogs){
      await api.post('/api/blogs').send(blog)
    }
    const receivedBlogs = await api.get('/api/blogs')
    for (let blog of receivedBlogs.body){
      
      assert(blog.user !== undefined)
      assert(blog.user.username !== undefined)
      assert(blog.user.name !== undefined)
    }
    
  })

  test('user contains the blogs created by them', async () =>{
    //currently the blogs are assigned users randomly, so we first add the users then we add the blogs and then
    //we check if users retrieved contain blog info or not
    await User.deleteMany({}) 
    await Blog.deleteMany({})
    for (let user of users){
      await api.post('/api/users').send(user)
    }
    for (let blog of blogs){
      await api.post('/api/blogs').send(blog)
    }
    const receivedUsers = await api.get('/api/users')
    for (let user of receivedUsers.body){
      
      assert(user.blogs)
      for (let blog of user.blogs){
        
        assert(blog.url !== undefined)
        assert(blog.title !== undefined)
        assert(blog.author !== undefined)

        

      }
    }
  })

})

describe('tests for adding a blog pass', async () => {


  


  test('new blog is added successfully when all fields exist', async () => {

   


    const blogToAdd = {
        title: "You Don't Know JS",
        author: 'Kyle Simpson',
        url: 'https://github.com/getify/You-Dont-Know-JS',
        likes: 25
      }

    
     
     const authorizationHeader = await getAuthorizationHeader()


    const result = await api
    .post('/api/blogs')
    .set({Authorization: authorizationHeader})
    .send(blogToAdd)
    .expect(201)
    .expect('Content-Type', /application\/json/)


    const returnedBlogs = await api.get('/api/blogs')

    const returnedBlogsContent = returnedBlogs.body.map(blog => {
        const {id, ...blogContent} = blog //destructuring to remove the id because we want to match the content of saved notes to the expected notes, not the id (we can't predict the id so we can't really match it with id from saved blogs)
        return blogContent
    }  
    )

    let newBlogAdded = false
    returnedBlogsContent.forEach(blog => {
        const { user, id, ...actualBlog} = blog
        if (JSON.stringify(actualBlog) === JSON.stringify(blogToAdd)){
            newBlogAdded = true
        }
    })


    assert.strictEqual(returnedBlogs.body.length, blogs.length + 1)
    assert(newBlogAdded)
    
    

})

test ('if likes is missing, it is set to 0', async () => {
  const blogToAdd = {
    title: "You Don't Know JS",
    author: 'Kyle Simpson',
    url: 'https://github.com/getify/You-Dont-Know-JS'
  }

 
  const authorizationHeader = await getAuthorizationHeader()

  const returnedBlog = await api
  .post('/api/blogs')
  .set({Authorization: authorizationHeader})
  .send(blogToAdd)

  
  assert.strictEqual(returnedBlog.body.likes, 0)
})

test('missing url or title returns error message with status code 400', async () => {
  const badBlogs = [
    {
      title: "You Don't Know JS",
      author: 'Kyle Simpson'
    }, 
    {
      author: 'Kyle Simpson',
      url: 'https://github.com/getify/You-Dont-Know-JS'
    },
    {
      author: 'Author'
    }
  ]

  
  const authorizationHeader = await getAuthorizationHeader()

  
    response = await api
    .post('/api/blogs')
    .send(badBlogs[0])
    .set({Authorization: authorizationHeader})
    .expect(400)
    .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('url is required'))

    response = await api
    .post('/api/blogs')
    .send(badBlogs[1])
    .set({Authorization: authorizationHeader})
    .expect(400)
    .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('title is required'))

    response = await api
    .post('/api/blogs')
    .send(badBlogs[2])
    .set({Authorization: authorizationHeader})
    .expect(400)
    .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('title is required'))
    assert(response.body.error.includes('url is required'))
 
  
  
})

test('missing token leads to status code 401 Unauthorised', async () => {
  const blog = {
    title: "This blog will not be added",
    url: "url",
    author: "author",
    likes : 10
  }

  const response = await api
    .post('/api/blogs')
    .send(blog)
    .expect(401)
    .expect('Content-Type', /application\/json/)


  assert(response.body.error.includes('invalid token'))


})

})

describe('all tests for deleting a blog pass', () => {

  test('blog is deleted if it exists and deleted blog is returned with status code 200', async () => {

    await Blog.deleteMany({})
    
    const authorizationHeader = await getAuthorizationHeader()

   
   
    

    

    //add a blog

    const blogToAdd = {
      title: 'to be deleted during testing',
      author: 'author',
      url: 'url'
    }
    const addedBlog = await api
    .post('/api/blogs')
    .set({Authorization: authorizationHeader})
    .send(blogToAdd)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    

  
    
    
   

    const deletedBlog = await api
    .delete(`/api/blogs/${addedBlog.body.id}`)  
    .set({Authorization: authorizationHeader})
    .expect(200)
    .expect('Content-Type', /application\/json/)

    

    const newBlogs = await api.get('/api/blogs')
    //since we deleted all the blogs in the beginning, and then added and deleted a blog, newBlogs.body must be empty
    assert.strictEqual(newBlogs.body.length, 0)
   


    assert.deepStrictEqual(deletedBlog.body, addedBlog.body)
    

    
    


  })

  test('if blog with the id is not found status code 404 is returned', async () => {

    const fakeId = await fakeIdGenerator()

    const authorizationHeader = await getAuthorizationHeader()

    
  
    let response = await api
    .delete(`/api/blogs/${fakeId}`)
    .set({Authorization: authorizationHeader})
    .expect(404)
    assert(response.body.error.includes('blog does not exist'))
  })


  test('missing token leads to status code 401 Unauthorised', async () => {

    const authorizationHeader = await getAuthorizationHeader()

    //add a blog

    const blogToAdd = {
      title: 'to be deleted during testing',
      author: 'author',
      url: 'url'
    }
    const addedBlog = await api
    .post('/api/blogs')
    .set({Authorization: authorizationHeader})
    .send(blogToAdd)

    const blogId = addedBlog.body.id
   

    const response = await api
      .delete(`/api/blogs/${blogId}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  
  
    assert(response.body.error.includes('invalid token'))
  
  
  })

  


})

describe('all tests for updating the blog pass', ()=>{


  test('blog is updated if it exists and updated blog is returned with status code 200', async () => {

    await Blog.deleteMany({})

    const authorizationHeader = await getAuthorizationHeader()

    //add a blog

    const blogToAdd = {
      title: 'to be updated during testing',
      author: 'author',
      url: 'url'
    }
    const addedBlog = await api
    .post('/api/blogs')
    .set({Authorization: authorizationHeader})
    .send(blogToAdd)
    .expect(201)
    .expect('Content-Type', /application\/json/)


    let newBlog = ({
      title: 'updated blog',
      author: 'author',
      url: 'url',
      likes: 20
    })

    const originalBlogs = await api.get('/api/blogs')

    const blogToUpdate = originalBlogs.body[0]

    const updatedBlog = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set({Authorization: authorizationHeader})  
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogsInDb = await api.get('/api/blogs')
    const blogReceived = blogsInDb.body[0]

    //since we delted all blogs in the beginning, only one blog exists
    const userIdReceivedInBlog = blogReceived.user.id
    blogReceived.user = userIdReceivedInBlog

    //check if the updated blog returned is same as the blog that was sent
    assert.deepStrictEqual(updatedBlog.body, blogReceived)
    //check if no blog was deleted
    assert.strictEqual(originalBlogs.body.length, blogsInDb.body.length)
    
    

    
    



  })

  test('if blog with the id is not found status code 404 is returned', async () => {

    const authorizationHeader = await getAuthorizationHeader()

    const blogToAdd = {
      title: 'to be updated during testing',
      author: 'author',
      url: 'url'
    }



    const fakeId = await fakeIdGenerator()
    const response = await api.put(`/api/blogs/${fakeId}`)
    .set({Authorization: authorizationHeader})
    .send(blogToAdd)
    .expect(404)

    assert(response.body.error.includes('blog does not exist'))
  })

  test('missing token leads to status code 401 Unauthorised', async () => {

    const authorizationHeader = await getAuthorizationHeader()
    //add a blog

    const blogToAdd = {
      title: 'to be deleted during testing',
      author: 'author',
      url: 'url'
    }
    const addedBlog = await api
    .post('/api/blogs')
    .set({Authorization: authorizationHeader})
    .send(blogToAdd)

    const blogId = addedBlog.body.id
   

    const newBlog = {
      title: "This blog will not be added",
      url: "url",
      author: "author",
      likes : 10
    }
  
    const response = await api
      .put(`/api/blogs/${blogId}`)
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  
  
    assert(response.body.error.includes('invalid token'))
  
  
  })
  

})




after(async () => {
  await mongoose.connection.close()
})