import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "../styles/SignInComponent.css"

import { useEffect, useState }  from 'react'
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { userData } from "three/examples/jsm/nodes/Nodes.js";
import MainPageComponent from "./MainPageComponent";


export default function SignUp() {

  const navigate = useNavigate();

  const logOut = () => {
    getAuth().signOut()
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    if (data.get("email") != '' && data.get("password") != '' 
        && data.get("passwordConfirm") != '' && data.get("password") == data.get("passwordConfirm")
        && data.get("password")!.length >= 6)
    {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, data.get("email")!.toString(), data.get("password")!.toString())
        .then( async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          const token = await user.getIdToken()
          window.localStorage.setItem('token', token)
          window.localStorage.setItem('email', user.email!)
          window.localStorage.setItem('auth', 'true')
          window.localStorage.setItem('uid', user.uid)
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }
    else
    {
      console.log("incorrecto")
    }
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="passwordConfirm"
              label="Repite tu contraseña"
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
              <Grid item>
                <Link href="/login" variant="body2">
                  {"¿Estás registrado? Inicia Sesión"}
                </Link>
              </Grid>
            </Grid>
          </Box>
     </Box>
  </Container>
    </div>
  );
}