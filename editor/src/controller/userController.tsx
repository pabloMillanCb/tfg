import React, { useContext, useState, useEffect, createContext } from "react"
import { firebaseAuth } from "../config/firebase-config"
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { Loader } from "three"

interface AuthContextInterface {
    currentUser: User | undefined,
    login: (email: string, password: string) => void,
    signup: (email: string, password: string) => void,
    logout: () => void,
}

interface AuthContextChildren {
    children: JSX.Element
}
// @ts-ignore
const AuthContext = createContext<AuthContextInterface>()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider( props: AuthContextChildren ) {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(firebaseAuth, email, password)
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(firebaseAuth, email, password)
  }

  function logout() {
    return firebaseAuth.signOut()
  }

  /*
  function updateEmail(email: string) {
    return currentUser!.updateEmail(email)
  }

  function updatePassword(password: string) {
    return currentUser.updatePassword(password)
  }
  */

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
        if (user == null){ setCurrentUser(undefined) }
        else { setCurrentUser(user) }
        setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextInterface = {
    currentUser,
    login,
    signup,
    logout
  }
  

  return (
    <>
      <AuthContext.Provider value={value}>
        {!loading && props.children}
      </AuthContext.Provider>
    </>
    
  )
}