import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "../styles/SignInComponent.css"

import MainPageComponent from "./MainPageComponent";

import { useEffect, useState }  from 'react'
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, browserSessionPersistence } from "firebase/auth";
import { userData } from "three/examples/jsm/nodes/Nodes.js";


export default function SignIn() {

  const navigate = useNavigate();
  const [auth, setAuth] = useState(
		false || getAuth().currentUser != undefined
	);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    const auth = getAuth();
    
    signInWithEmailAndPassword(auth, data.get("email")!.toString(), data.get("password")!.toString())
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log({
          email: data.get("email")
        });
        const token = await user.getIdToken()
        window.localStorage.setItem('token', token)
        window.localStorage.setItem('email', user.email!)
        window.localStorage.setItem('auth', 'true')
        setAuth(window.localStorage.getItem('auth') === 'true')
        navigate("/")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

    
    //navigate("/editor");
  };

  return (
    <div className="background">
      <Container component="main" maxWidth="xs">
        <Box
          sx={{  
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/editor" variant="body2">
                  Recuperar contraseña
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"¿No tienes cuenta? Registrate"}
                </Link>
              </Grid>
            </Grid>
          </Box>
     </Box>
  </Container>
    </div>
  );
}