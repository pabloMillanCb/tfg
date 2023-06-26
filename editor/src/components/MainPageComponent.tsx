import { getAuth } from "firebase/auth"
import "../styles/LandingPage.css"
import { useNavigate } from "react-router-dom";
import '../styles/MainPageComponent.css'
import HomeIcon from '@mui/icons-material/Home';
import { Stack, Button, IconButton, Grid, TextField, Select, MenuItem, InputLabel, FormControl, Box, SelectChangeEvent} from "@mui/material"
import axios from "axios";
import { Logout } from "@mui/icons-material";
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