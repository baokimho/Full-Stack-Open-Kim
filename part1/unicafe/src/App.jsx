import { useState } from 'react'

const Button = ({ onclick, Text }) => (
  <button onClick={onclick}>{Text}</button>
)

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
      <div>Good: {good}</div>
      <div>Neutral: {neutral}</div>
      <div>Bad: {bad}</div>
    </div>
  )
}

export default App