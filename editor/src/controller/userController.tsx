import { useContext, useState, useEffect, createContext } from "react"
import { firebaseAuth } from "../config/firebase-config"
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail } from "firebase/auth"

import { useLoading } from "./loadingController"

interface AuthContextInterface {
    currentUser: User | undefined,
    login: (email: string, password: string) => void,
    signup: (email: string, password: string) => void,
    logout: () => void,
    updateUserEmail: (email: string, password: string) => Promise<string>,
    updatePassword: (password: string) => Promise<string>,
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
  const [loadingUser, setLoadingUser] = useState(true)
  const { setLoading } = useLoading()

  function signup(email: string, password: string) {
    setLoading(true)
    return createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }

  async function login(email: string, password: string) {
    setLoading(true)
    return signInWithEmailAndPassword(firebaseAuth, email, password)
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }

  function logout() {
    setLoading(true)
    return firebaseAuth.signOut()
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }

  
  async function updateUserEmail(email: string, password: string): Promise<string> {
    setLoading(true)
    try {
      await login(currentUser?.email!, password)
    } catch {
      setLoading(false)
      return "Contraseña incorrecta"
    }

    try {
      await updateEmail(currentUser!, email)
      await currentUser?.reload()
      setLoading(false)
      return ''
    } catch {
      setLoading(false)
      return "Formato de correo inválido"
    }
  }

  async function updatePassword(password: string): Promise<string> {
    setLoading(true)
    try {
      await login(currentUser?.email!, password)
    } catch {
      setLoading(false)
      return "Contraseña incorrecta"
    }

    try {
      await updatePassword(password)
      await currentUser?.reload()
      setLoading(false)
      return ''
    } catch {
      setLoading(false)
      return "Hubo un error inesperado, vuelva a probar"
    }
  }
  

  useEffect(() => {
    setLoading(true)
    const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
        if (user == null){ setCurrentUser(undefined) }
        else { setCurrentUser(user) }
        setLoading(false)
        setLoadingUser(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextInterface = {
    currentUser,
    login,
    signup,
    logout,
    updateUserEmail,
    updatePassword
  }
  

  return (
    <>
      <AuthContext.Provider value={value}>
        {!loadingUser && props.children}
      </AuthContext.Provider>
    </>
    
  )
}