
import EditorComponent from './components/EditorComponent'
import SignIn from './components/SignInComponent'
import GuardedRoute from './components/GuardedRoute'
import MainPageComponent from './components/MainPageComponent'
import './App.css'
import { Route, Routes,BrowserRouter} from "react-router-dom";
import { useState } from 'react';
import SignUp from './components/SignUpComponent'
import ConfigComponent from './components/ConfigComponent'
import SceneInterface from "./interfaces/SceneInterface"
import { AuthProvider } from './controller/userController'
import { SceneProvider } from './controller/sceneController'
import GuardedRouteLogin from './components/GuardedRouteLogin'
import { LoadingProvider } from './controller/loadingController'

function App() {

  const ROOT = "/"
  const EDITOR = "/editor"
  const LOGIN = "/signin"
  const REGISTER = "/signup"
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
    <div className='too-small'>
        <p className="bienvenida-usuario center center-v">Accede a la aplicación desde un dispositivo de escritorio</p>
        <p className=" center center-v">Esta web está diseñada con portátiles y ordenadores en mente. Por favor, usa uno de estos dispositivos para una mejor experiencia.</p>
        <div className='center-v'><img src="src/assets/laptop-screen.png" alt="" /></div>
        {/*https://www.flaticon.com/free-icon/laptop-screen_2888701?term=laptop&page=1&position=12&origin=search&related_id=2888701 https://www.flaticon.com/authors/vectorsmarket15*/}
        
    </div>
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
