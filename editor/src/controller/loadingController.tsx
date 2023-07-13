import React, { useContext, useState, createContext } from "react"
import Loader from "../components/Loader"

interface LoadingControllerInterface {
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

interface LoadingContextChildren {
    children: JSX.Element
}

// @ts-ignore
const LoadingContext = createContext<LoadingControllerInterface>()


export function useLoading() {
  return useContext(LoadingContext)
}

export function LoadingProvider( props: LoadingContextChildren ) {
  const [loading, setLoading] = useState(false)

  const value: LoadingControllerInterface = {
    loading,
    setLoading,
  }
  

  return (
    <LoadingContext.Provider value={value}>
      <Loader loading={loading}/>
      {props.children}
    </LoadingContext.Provider>
  )
}