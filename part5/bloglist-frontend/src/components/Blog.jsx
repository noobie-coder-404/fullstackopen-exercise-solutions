import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const addLikes = (event) => {
    event.preventDefault()

    updateBlog({ ...blog, likes: blog.likes + 1 })
  }

  const deleteThisBlog = (event) => {
    event.preventDefault()

    if (
      window.confirm(`Do you want to delete ${blog.title} by ${blog.author} ?`)
    ) {
      deleteBlog(blog)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  if (detailsVisible) {
    return (
      <div style={blogStyle} data-testid={blog.title} class='blog'>
        <div>
          {blog.title}{' '}
          <button onClick={() => setDetailsVisible(false)}>hide</button>
        </div>
        <div className='url'>
          <a href={blog.url} >{blog.url}</a>
        </div>
        <div className='likes' data-testid='likes'>
          {blog.likes} <button onClick={addLikes}>like</button>
        </div>
        <div>
          {blog.user.name} ({blog.user.username})
        </div>
        <button onClick={deleteThisBlog}>delete</button>
      </div>
    )
  }

  return (
    <div style={blogStyle} className='title-author'>
      {blog.title} {blog.author}{' '}
      <button onClick={() => setDetailsVisible(true)}>show</button>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
}



export default Blog
