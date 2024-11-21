const blogsRouter = require('express').Router()

const { response } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')



blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.status(200).json(blogs)
  
    
  })
  
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {

  const newBlog = request.body
 

  const user = await  User.findById(request.user.id)
  if (!user){
    return response.status(400).json({error: 'user does not exist'})
  }
  newBlog.user = user._id //add the user to the blog's user field
 
  //save the blog
  const result = await new Blog(request.body).save()

  //add the blog to the user's blogs
  const newBlogsList = user.blogs.concat(result._id)
  
  
  await User.findByIdAndUpdate(user._id, {blogs: newBlogsList}, {new: true})
    
  response.status(201).json(result)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const toBeDeleted = await Blog.findById(request.params.id)

  if(!toBeDeleted){
    
    return response.status(404).json({error: 'blog does not exist'})
  }

  


  
  
  if (request.user.id !== toBeDeleted.user.toString()){
    return response.status(401).json({error: 'only the creator of a blog can delete it'})
  }

  
  const user = await User.findById(request.user.id)
  //remove the id of the blog from the user's bloglist
  const userBlogs = user.blogs.filter(blog => blog.toString() !== toBeDeleted._id.toString())
 
  
  //update the user
  await Blog.findOneAndUpdate(toBeDeleted._id, {blogs: userBlogs}, {new: true} )

  //delete the blog
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
  deletedBlog === null ? response.status(404).end() : response.status(200).json(deletedBlog)
})

blogsRouter.put('/:id',middleware.userExtractor, async (request, response) => {
  const newBlog = request.body

  

  if (!newBlog){
    return response.status(400).json({error: 'new blog with which the blog is to be updated is missing'})
  }

  const toBeUpdated = await Blog.findById(request.params.id)

 

  if(!toBeUpdated){
    
    return response.status(404).json({error: 'blog does not exist'})
  }

  
  if (request.user.id !== toBeUpdated.user.toString()){
    return response.status(401).json({error: 'only the creator of a blog can update it'})
  }

  

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {new: true, runValidators: true})
  response.status(200).json(updatedBlog)
})
  
module.exports = blogsRouter