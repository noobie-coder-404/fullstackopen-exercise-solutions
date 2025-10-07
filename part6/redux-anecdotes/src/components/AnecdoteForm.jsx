import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import {notification} from '../reducers/notificationReducer'
import anecdoteServices from './services/anecdoteServices'
import {createNew} from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()


      const newAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        console.log('content is ', content )
        event.target.anecdote.value = ''
        // dispatch(createAnecdote(content))
        // const newAnecdote = await anecdoteServices.createNew(content)
        // dispatch(createAnecdote(newAnecdote))
        dispatch(createNew(content))
        // dispatch(setNotification(`Created anecdote "${content}"`))
        dispatch(notification(`Created anecdote "${content}"`, 3 ))


      }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit = {newAnecdote}>
                <div>
                    <input name = "anecdote"/>
                </div>
                <button>create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm