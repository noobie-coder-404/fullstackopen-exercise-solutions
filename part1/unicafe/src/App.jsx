import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick = {onClick}>{text}</button>

const StatisticLine = ({text, value}) => {

  if (text === 'positive') {
    return (
      <tr>
        <td>{text}</td> 
        <td>{value} %</td>
      </tr>
    )
  }
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}


const Statistics = ({good, neutral, bad}) => {

  const all = good+bad+neutral 

  if (all === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p> No feedback given</p>
      </div>
    )
  }
  
  const total = (good*1) + (bad*(-1)) 
  const average = total/all 

  const positive = (good/all)*100

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text = "good" value={good} />
          <StatisticLine text = "neutral" value={neutral} />
          <StatisticLine text = "bad" value={bad} />
          <StatisticLine text = "all" value={all} />
          <StatisticLine text = "average" value={average} />
          <StatisticLine text = "positive" value={positive} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  
  const handleGoodFeedback = () => {
    console.log('increase good by 1, previous value: ', good)
    setGood(good + 1)
  }

  const handleNeutralFeedback = () => {
    console.log('increase neutral by 1, previous value: ' , neutral)
    setNeutral(neutral + 1)
  }

  const handleBadFeedback = () => {
    console.log('increase bad by 1, previous value: ', bad)
    setBad(bad+1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      < Button onClick = {handleGoodFeedback} text = 'good' />
      < Button onClick = {handleNeutralFeedback} text='neutral' />
      < Button onClick = {handleBadFeedback} text = 'bad'/>
      < Statistics good = {good} neutral = {neutral} bad = {bad} />
    </div>
  )
}



export default App