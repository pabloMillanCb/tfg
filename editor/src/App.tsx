
import EditorComponent from './components/EditorComponent'
import LandingPage from './components/LandingPage'
import SignIn from './components/SignInComponent'
import GuardedRoute from './components/GuardedRoute'
import MainPageComponent from './components/MainPageComponent'
import './App.css'
import { Route, Routes,BrowserRouter} from "react-router-dom";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from './config/firebase-config'
import SignUp from './components/SignUpComponent'
import SceneList from './components/SceneList'

function App() {

  const ROOT = "/"
  const EDITOR = "/editor"
  const LOGIN = "/login"
  const REGISTER = "/register"
  const SCENES = "/scenes"

  const [auth, setAuth] = useState(
		false || window.localStorage.getItem('auth') === 'true'
	);
	const [token, setToken] = useState('');

  const [user, setUser] = useState(undefined)

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
	}, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<GuardedRoute/>}>
            <Route element={<MainPageComponent/>} path={ROOT} />
            <Route element={<EditorComponent/>} path={EDITOR} />
            <Route element={<SceneList/>} path={SCENES} />
          </Route>
          <Route element={<SignIn/>} path={LOGIN}/>
          <Route element={<SignUp/>} path={REGISTER}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
