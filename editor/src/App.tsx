import { useState }  from 'react'
import EditorComponent from './components/EditorComponent'
import './App.css'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <EditorComponent />
    </>
  )
}

export default App
