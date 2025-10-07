import axios from 'axios'


const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const createNew = async (content) => {
    const object = {content, votes: 0}
    console.log('axios object - ', object)
    const response = await axios.post(baseUrl, object)
    console.log('axios - ', response.data)
    return response.data
}

const vote = async (id, changedAnecdote) => {
    const url = `${baseUrl}/${id}`
    const response = await axios.put(url, changedAnecdote)
    console.log ('anecdote after voting -', response.data)
    return response.data
    

}

export default {getAll, createNew, vote}
