import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const addBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log('blog', newBlog)
  console.log('config', config)
  const response = await axios.post(baseUrl, newBlog, config)
  console.log(response.data)
  return response.data
}

const updateBlog = async (updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const blogId = updatedBlog.id
  updatedBlog.id ? delete updatedBlog.id : null // this will be ignored by mongodb even if sent but deleting for good measure
  updatedBlog.user ? delete updatedBlog.user : null // this needs to be deleted otherwise error occurs because mongodb doesn't expect a user field when updating

  const response = await axios.put(`${baseUrl}/${blogId}`, updatedBlog, config)
  return response.data
}

const deleteBlog = async (idToDelete) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${idToDelete}`, config)
  return response.data
}
export default { setToken, addBlog, updateBlog, deleteBlog }
