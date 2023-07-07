
import EditorComponent from './components/EditorComponent'
import LandingPage from './components/LandingPage'
import SignIn from './components/SignInComponent'
import GuardedRoute from './components/GuardedRoute'
import MainPageComponent from './components/MainPageComponent'
import './App.css'
import { Route, Routes,BrowserRouter} from "react-router-dom";
import { createContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from './config/firebase-config'
import firebase from './config/firebase-config'
import SignUp from './components/SignUpComponent'
import SceneList from './components/SceneList'
import ConfigComponent from './components/ConfigComponent'
import SceneInterface from "./interfaces/SceneInterface"
import { Scene } from 'three'
import { AuthProvider } from './controller/userController'
import { SceneProvider } from './controller/sceneController'
import Loader from './components/Loader'
import GuardedRouteLogin from './components/GuardedRouteLogin'
import { LoadingProvider } from './controller/loadingController'

function App() {

  const ROOT = "/"
  const EDITOR = "/editor"
  const LOGIN = "/login"
  const REGISTER = "/register"
  const CONFIG = "/config"


  const newScene: SceneInterface = {
    "id": "",
    "name": "",
    "scene_type": "",
    "audio": "",
    "loop": true,
    "image_url": "",
    "coordinates": [0, 0, 0],
    "model_url": "",
    "animations" : []
  }

  const [scene, setScene] = useState<SceneInterface>(newScene)

  return (
    <>
      <BrowserRouter>
      <LoadingProvider>
        <AuthProvider>
          <SceneProvider>
          <Routes>
            
            <Route element={<GuardedRoute/>}>
              <Route element={<MainPageComponent setScene={setScene}/>} path={ROOT} />
              <Route element={
                <EditorComponent
                  { ...scene }
                />
                } path={EDITOR} />
              <Route element={<ConfigComponent/>} path={CONFIG} />
            </Route>
            <Route element={<GuardedRouteLogin/>}>
              <Route element={<SignIn/>} path={LOGIN}/>
              <Route element={<SignUp/>} path={REGISTER}/>
            </Route>
            
          </Routes>
          </SceneProvider>
        </AuthProvider>
      </LoadingProvider>
      </BrowserRouter>
    </>
  )
}

export default App
