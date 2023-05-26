import { useState }  from 'react'
import EditorComponent from './components/EditorComponent'
import LandingPage from './components/LandingPage';
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
function App() {

  const [count, setCount] = useState(0)

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "editor",
      element: <EditorComponent />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
