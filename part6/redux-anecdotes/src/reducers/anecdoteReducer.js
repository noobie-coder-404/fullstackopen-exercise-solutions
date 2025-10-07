import { createSlice } from "@reduxjs/toolkit"
import anecdoteServices from '../components/services/anecdoteServices'
import {setNotification} from '../reducers/notificationReducer'

// export const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

// const initialState = anecdotesAtStart.map(asObject)  



const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState : [],
  reducers: {
    addVote(state, action) {
       return state.map((anecdote) => 
        anecdote.id === action.payload
          ? {...anecdote, votes : anecdote.votes+1} 
          : anecdote)
    },
    createAnecdote(state, action) {
        console.log('reducer - ', action.payload)
        // return state.concat(asObject(action.payload)) we can mutate the state now since redux toolkit uses Immer internally, hence the new code is in next line
        // state.push(asObject(action.payload))
        state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const {addVote, createAnecdote,setAnecdotes} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteServices.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createNew = (content) => {
  return async dispatch => {
     const newAnecdote = await anecdoteServices.createNew(content)
     dispatch(createAnecdote(newAnecdote))
  }
}

export const vote = (id) => {
  return async (dispatch, getState) => {
    const anecdoteToChange = getState().anecdotes.find(anecdote => anecdote.id === id)
    const votedAnecdote = await anecdoteServices.vote(id, {...anecdoteToChange, votes: anecdoteToChange.votes+1})
    console.log('voted for ', votedAnecdote)
    dispatch(addVote(id))
  }
}

export default anecdoteSlice.reducer