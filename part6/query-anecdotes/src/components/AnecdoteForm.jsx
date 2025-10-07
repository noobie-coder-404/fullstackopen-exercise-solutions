import {useQuery, useMutation,useQueryClient, notifyManager} from '@tanstack/react-query'
import {createAnecdote} from '../../requests.js'
import { useNotification } from '../AnecdoteContext.jsx'

const AnecdoteForm = () => {
  const notify = useNotification()
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      // queryClient.invalidateQueries({queryKey: ['anecdotes']})
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      console.log('new anecdote -', newAnecdote)
    },
    onError: () => notify("Anecdote is too short. Must have a length of 5 or more.")
  })

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, votes: 0})
    notify(`Created anecdote "${content}"`)

}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
