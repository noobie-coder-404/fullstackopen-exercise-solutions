import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import blogActions from './services/blogActions'
import { use } from 'react'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const togglableRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
  }, [])

  const errorNotification = (errorMessage) => {
    setError(true)
    setMessage(errorMessage)

    setTimeout(() => {
      setMessage(null)
      setError(null)
    }, 3000)
  }

  const successNotification = (successMessage) => {
    setError(false)
    setMessage(successMessage)

    setTimeout(() => {
      setMessage(null)
      setError(null)
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    console.log('handleLogin triggered')

    try {
      console.log('try block triggered')
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      errorNotification('Wrong Credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const newBlog = async ({ title, author, url }) => {
    try {
      blogActions.setToken(user.token)
      const addedBlog = await blogActions.addBlog({ title, author, url })
      setBlogs(blogs.concat(addedBlog).sort((a, b) => b.likes - a.likes))
      successNotification(
        `Added blog '${addedBlog.title}' by ${addedBlog.author}`,
      )
      togglableRef.current.toggleVisibility()
    } catch {
      errorNotification('Error Occured : Blog not added')
    }
  }

  const updateBlog = async (updatedBlog) => {
    try {
      blogActions.setToken(user.token)
      const updatedBlogReceived = await blogActions.updateBlog(updatedBlog)
      console.log('updated blog', updatedBlogReceived)
      const updatedBlogsList = blogs.map((blog) =>
        blog.id === updatedBlogReceived.id
          ? { ...updatedBlogReceived, user: blog.user }
          : blog,
      )
      updatedBlogsList.sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogsList)
    } catch {
      errorNotification('Error Occured: Blog not updated')
    }
  }

  const deleteBlog = async (blogToDelete) => {
    try {
      blogActions.setToken(user.token)
      const deletedBlog = await blogActions.deleteBlog(blogToDelete.id)
      const updatedBlogsList = blogs.filter(
        (blog) => blog.id !== blogToDelete.id,
      )
      updatedBlogsList.sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogsList)
      successNotification(
        `'${deletedBlog.title}' by ${deletedBlog.author} deleted`,
      )
    } catch {
      errorNotification('Error Occured: Blog not deleted')
    }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>username</div>
        <input
          data-testid = 'username'
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />

        <div>password</div>
        <input
          data-testid = 'password'
          type='password'
          value={password}
          name='Password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <button type='submit'>Login</button>
        </div>
      </form>
    </div>
  )

  const allBlogs = () => (
    <div>
      <p>{user.name} logged in.</p>
      <button onClick={handleLogout}>LogOut</button>
      <h2>blogs</h2>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  )

  return (
    <>
      <Notification message={message} error={error} />
      <Togglable buttonLabel={'add new blog'} ref={togglableRef}>
        <BlogForm createBlog={newBlog} />
      </Togglable>

      {user === null ? loginForm() : allBlogs()}
    </>
  )
}

export default App
