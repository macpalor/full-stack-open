import { useState } from 'react'

const Header = ({header}) => <h1>{header}</h1>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

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
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [selected, setSelected] = useState(0)

  const nextAnecdote = (arr) => {
    const randInt = Math.floor(Math.random() * arr.length) //random integer from 0 to arr.length
    setSelected(randInt)
  }

  const vote = (arr, index) => {
    const copy = [...arr]
    copy[index] += 1
    setVotes(copy)
  }

  const indexOfMax = (arr) => {
    let max = 0
    let max_i = 0
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i]
        max_i = i
      }
      
    }
    return max_i
  }
  
  return (
    <div>
      <Header header={"Anecdote of the day"} />
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button onClick={() => nextAnecdote(anecdotes)} text="next anecdote" />
      <Button onClick={() => vote(votes, selected)} text="vote" />
      <Header header={"Anecdote with the most votes"} />
      <p>{anecdotes[indexOfMax(votes)]}</p>
      <p>has {votes[indexOfMax(votes)]} votes</p>
    </div>
  )
}

export default App
