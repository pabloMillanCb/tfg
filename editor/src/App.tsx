
import EditorComponent from './components/EditorComponent'
import LandingPage from './components/LandingPage'
import SignIn from './components/SignInComponent'
import GuardedRoute from './components/GuardedRoute'
import MainPageComponent from './components/MainPageComponent'
import './App.css'
import { Route, Routes,BrowserRouter} from "react-router-dom";
import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from './config/firebase-config'
import SignUp from './components/SignUpComponent'
import SceneList from './components/SceneList'
import ConfigComponent from './components/ConfigComponent'
import SceneInterface from "./interfaces/SceneInterface"
import { Scene } from 'three'

function App() {

  const ROOT = "/"
  const EDITOR = "/editor"
  const LOGIN = "/login"
  const REGISTER = "/register"
  const CONFIG = "/config"

  const [auth, setAuth] = useState(
		false || window.localStorage.getItem('auth') === 'true'
	);
	const [token, setToken] = useState('');

  const [user, setUser] = useState(undefined)

  const newScene: SceneInterface = {
    "id": "",
    "name": "",
    "scene_type": "",
    "sound": "",
    "loop": true,
    "image_url": "",
    "coordinates": [],
    "model_url": "",
    "animations" : []
  }

  const [scene, setScene] = useState<SceneInterface>(newScene)
  const MyContext = createContext(234)

  useEffect(() => {
		onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setAuth(true);
				window.localStorage.setItem('auth', 'true');
				user.getIdToken().then((token) => {
					setToken(token);
				});
        const uid = user.uid;
        console.log(uid)
        //setUser(user)
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
    console.log('INTERFAZ: ' + scene?.id)
	}, []);

  return (
    <>
      <BrowserRouter>
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
          <Route element={<SignIn/>} path={LOGIN}/>
          <Route element={<SignUp/>} path={REGISTER}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
