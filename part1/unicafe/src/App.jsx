import { useState } from 'react'

const Button = ({ onclick, Text }) => (
  <button onClick={onclick}>{Text}</button>
)

const Statistics = ({ good, neutral, bad }) => {
  const average = (1 * good + 0 * neutral + -1 * bad) / (good + neutral + bad)
  const positive = (good / (good + neutral + bad)) * 100

  if (good + neutral + bad === 0) {
    return <div>No feedback given</div>
  }
  
  return (
    <div>
      <div>Good: {good}</div>
      <div>Neutral: {neutral}</div>
      <div>Bad: {bad}</div>
      <div>Average: {isNaN(average) ? 0 : average}</div>
      <div>Positive: {isNaN(positive) ? 0 : positive}%</div>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      How was the service?
      <br />
      <Button onclick={() => setGood(good + 1)} Text="Good" />
      <Button onclick={() => setNeutral(neutral + 1)} Text="Neutral" />
      <Button onclick={() => setBad(bad + 1)} Text="Bad" />
      <br />
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App