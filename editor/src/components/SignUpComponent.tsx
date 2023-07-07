import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "../styles/SignInComponent.css"

import { useState }  from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../controller/userController";
import { Alert } from "@mui/material";
import HeaderComponent from "./HeaderComponent";


export default function SignUp() {

  const navigate = useNavigate();
  const { signup } = useAuth()
  const [error, setError] = useState("")

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get("password") != data.get("passwordConfirm"))
    {
      return setError('Las contraseñas no coinciden')
    }
    if (data.get("password")!.length < 6)
    {
      return setError('La contraseña debe tener almenos 6 caracteres')
    }

    try {
      setError('')
      await signup(data.get("email")!.toString(), data.get("password")!.toString())
      navigate('/')
    } catch {
      setError('Ese correo electrónico ya está en uso o es inválido')
    }
  };

  return (
    <>
    <HeaderComponent name="Nuevo usuario" home={true}/>
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
            {error != '' ? <Alert severity="error">{error}</Alert> : ''}
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
              Registrarme
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
  </>
  );
}