import { useDispatch, useSelector } from "react-redux";
// import { addVote, vote } from "../reducers/anecdoteReducer";
import {vote} from "../reducers/anecdoteReducer"
import {notification} from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    console.log('full state is: ', useSelector(state => state))
    const allAnecdotes = useSelector(({anecdotes, filter}) => anecdotes)
    const anecdotes = useSelector(({anecdotes, filter}) => 
        allAnecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter))
    )
    const voteForAnecdote = (id) => {
    console.log('vote', id)
    dispatch(vote(id))
    dispatch(notification(`Voted "${allAnecdotes.filter(anecdote => anecdote.id === id)[0].content}"`, 3)) //filter always returns an array, even if the array has only one element, hence used [0]
    }



    return (
        <div>
            {[...anecdotes].sort((a,b) => b.votes-a.votes).map(anecdote =>
            <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => voteForAnecdote(anecdote.id)}>vote</button>
                </div>
            </div>
      )}
        </div>
    )
}

export default AnecdoteList