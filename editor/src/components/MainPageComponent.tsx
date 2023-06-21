import { Button } from "@mui/material"
import { getAuth } from "firebase/auth"
import "../styles/LandingPage.css"
import { useNavigate } from "react-router-dom";
import '../styles/MainPageComponent.css'
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import axios from "axios";

function MainPageComponent() {

    const navigate = useNavigate();

    const logOut = () => {
        getAuth().signOut()
        window.localStorage.setItem('auth', '')
        navigate("/login")
      }


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
    <Container component="main" maxWidth="xs">
        <Box
          sx={{  
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p>¡Bienvenid@ {window.localStorage.getItem('email')}!</p>
          <Button
            onClick={dev}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Dev
          </Button>
          <Button
            onClick={() => {navigate("/scenes")}}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Mis escenas
          </Button>
          <Button
            onClick={() => {navigate("/editor")}}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Ajustes de usuario
          </Button>
          <Button
            onClick={logOut}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Cerrar Sesión
          </Button>
        </Box>
    </Container>
  )
}

export default MainPageComponent