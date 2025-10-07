import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => {

   return axios.get(`${baseUrl}`).then(res => res.data)
}

export const createAnecdote = (content) => {

    return axios.post(baseUrl, content).then(res => res.data)

}


export const voteAnecdote = (content) => {
    return axios.put(`${baseUrl}/${content.id}`, {...content, votes: content.votes + 1}).then( res => res.data)
}