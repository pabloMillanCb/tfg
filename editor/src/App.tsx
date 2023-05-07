import { useState }  from 'react'
import SceneComponent from './components/SceneComponent'
import './App.css'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SceneComponent />
    </>
  )
}

export default App
