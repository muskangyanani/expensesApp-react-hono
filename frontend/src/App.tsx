import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card bg-red-400">
        <p>{count}</p>
        <button onClick={() => setCount((count) => count + 1)}>up</button>
        <button onClick={() => setCount((count) => count - 1)}>down</button>
      </div>
    </>
  )
}

export default App
