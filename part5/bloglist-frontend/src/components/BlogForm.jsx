import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlogCreation = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setAuthor('')
    setUrl('')
    setTitle('')
  }

  return (
    <form onSubmit={handleBlogCreation}>
      <h2>new blog</h2>
      <div>
        Title
        <input
          data-testid='title'
          type='text'
          value={title}
          name='title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        Author
        <input
          data-testid='author'
          type='text'
          value={author}
          name='author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        URL
        <input
          data-testid='url'
          type='text'
          value={url}
          name='url'
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type='submit'>Add</button>
    </form>
  )
}

export default BlogForm
