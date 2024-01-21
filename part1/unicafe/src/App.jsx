import { useState } from 'react'

const Header = (props) => <h1>{props.header}</h1>

const Button = (props) => {
  return (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
  )
}

const Statistics = (props) => {
  return (
    <div>
      <p>good {props.good}</p>
      <p>neutral {props.neutral}</p>
      <p>bad {props.bad}</p>
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
      <Header header={"Give feedback"} />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Header header={"Statistics"} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
