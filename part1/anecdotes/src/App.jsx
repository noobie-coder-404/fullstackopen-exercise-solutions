import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick = {onClick}>{text}</button>

const Anecdote = ({anecdote, votes}) => {
  console.log({anecdote, votes})
  return (
    <>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </>
  )
}

const App = () => {

  
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState({})

  let currentVotes = votes[selected]
  if (currentVotes === undefined) {
    console.log('currentVotes is undefined, meaning it must be 0')
    currentVotes = 0
  }

  // handle generation of a new anecdote
  const handleNewAnecdote = () => {
    // generate a random number between 0 and the length of array anecdotes (exclusive)
    const newAnecdoteGenerator = () => Math.floor(Math.random()*anecdotes.length)
    let newAnecdote = newAnecdoteGenerator()

    console.log('Curent index is : ', selected)
    console.log('New Random index value generated is: ', newAnecdote)

    // in case same anecdote is generated again
    while (newAnecdote === selected) {
      console.log('Same anecdote generated, generating again.........')
      newAnecdote = newAnecdoteGenerator()
      console.log('New Random index value generated is: ', newAnecdote)
    }

    
    console.log('NEW ANECDOTE : ', anecdotes[newAnecdote])

    setSelected(newAnecdote)

  }
 
  // handle addition of a vote
  const handleVote = () => {
    const newCurrentVotes = currentVotes + 1
    const newVotes = {...votes, [selected]: newCurrentVotes}
    // newVotes[selected] = newCurrentVotes
    setVotes(newVotes)

    console.log('new votes', newVotes)
  }

  // find anecdote with most votes
  let mostVoted = 0
  let highestVotes = 0  // votes object will be empty in the beginning
  if (votes[mostVoted] === undefined ) {
    highestVotes = 0
  } else {
    highestVotes = votes[mostVoted]
  }
  for (let key in votes) {
    if ((votes[key] > highestVotes)) { 
      mostVoted = key
      highestVotes = votes[mostVoted]
      console.log(mostVoted, 'is the highest voted quote with ', highestVotes, 'votes')
    }
  }
  

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={anecdotes[selected]} votes = {currentVotes}/>
      <Button onClick = {handleVote} text = 'vote'/>
      <Button onClick = {handleNewAnecdote} text='next anecdote' />
      <h1>Anecdote with most votes</h1>
      <Anecdote anecdote = {anecdotes[mostVoted]} votes = {highestVotes}></Anecdote>
    </div>
  )
}



export default App