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


export default function SignIn() {

  const navigate = useNavigate();
  
  const { login } = useAuth()
  const [error, setError] = useState('')

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      setError('')
      await login(data.get("email")!.toString(), data.get("password")!.toString())
      navigate("/")
    } catch {
      setError('Usuario o contraseña incorrectos')
    }
  };

  return (
    <>
      <HeaderComponent name="Inicio de sesión" home={true}/>
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
                  <Link href="/register" variant="body2">
                    {"¿No tienes cuenta? Registrate"}
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