import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {getAnecdotes, voteAnecdote} from '../requests.js'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useNotification } from './AnecdoteContext.jsx'


const App = () => {

  const notify = useNotification()

  const queryClient = useQueryClient()
  const voteAnecdoteMutation = useMutation({
      mutationFn: voteAnecdote,
      onSuccess: (updatedAnecdote) => {
        const anecdotes = queryClient.getQueryData(['anecdotes'])
        queryClient.setQueryData(['anecdotes'], anecdotes.map(anecdote =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        ))
      } 
    })

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate(anecdote)
    notify(`Voted ${anecdote.content}`)

  }




  const result = useQuery({
    queryKey:['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  if (result.isLoading){
    return <div> loading... </div>
  }

  if (result.isError){
    return <div> anecdote service not available due to problems in server </div>
  }
  
  const anecdotes = result.data
  console.log(anecdotes)


  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
