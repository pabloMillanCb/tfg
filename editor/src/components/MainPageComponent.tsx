import "../styles/LandingPage.css"
import '../styles/MainPageComponent.css'
import SceneList from "./SceneList";
import HeaderComponent from "./HeaderComponent";
import SceneInterface from "../interfaces/SceneInterface";

interface MainPageInterface {
  setScene: (s: SceneInterface) => void
}


function MainPageComponent(props: MainPageInterface) {

  return (
    <>
      <HeaderComponent name="Página principal" home={true}/>
      <SceneList setScene={props.setScene}/>
    </>
  )
}

export default MainPageComponent