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
import HeaderComponent from "./HeaderComponent";


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
      // actualizar datos
    }
    else
    {
      console.log("incorrecto")
    }
  };

  return (
    <>
      <HeaderComponent name="Ajustes de usuario" home={false}/>
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
                defaultValue={window.localStorage.getItem('email')}
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Nueva contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="passwordConfirm"
                label="Repite la contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <p className="mensaje">Introduce tu contraseña actual</p>
              <TextField
                margin="normal"
                required
                fullWidth
                name="oldpassword"
                label="Contraseña actual"
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
                Actualizar datos
              </Button>
            </Box>
      </Box>
    </Container>
      </div>
    </>
    
  );
}