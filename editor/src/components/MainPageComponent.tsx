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

function MainPageComponent() {

    const navigate = useNavigate();

    const dev = async () => {
        console.log("dev")
        const token = window.localStorage.getItem('token')
        const res = await axios.get('http://localhost:5000/get/escenas', {
			headers: {
				Authorization: 'Bearer ' + token,

			},
		})
		console.log(res.data);
    }

  return (
    <>
      <HeaderComponent name="Página principal" home={true}/>
      <SceneList/>
    </>
  )
}

export default MainPageComponent