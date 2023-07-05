import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "../styles/SignInComponent.css"
import { useState }  from 'react'
import { useNavigate } from "react-router-dom";
import HeaderComponent from "./HeaderComponent";
import { useAuth } from "../controller/userController";
import { Alert } from "@mui/material";


export default function SignUp() {

  const navigate = useNavigate()
  console.log
  const { updateUserEmail } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { currentUser } = useAuth()

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    currentUser?.reload()

    await setError('')
    await setSuccess('')
    
    if (data.get("email") == currentUser?.email && data.get("newPassword") == '')
    {
      return await setError("Introduce un nuevo email o contraseña")
    }
    if (data.get("newPassword") != '')
    {
      if (data.get("newPassword") != data.get("passwordConfirm"))
      {
        return await setError("Las contraseñas deben coincidir")
      }
      else if (data.get("newPassword")!.length < 6)
      {
        return await setError("La contraseña debe de tener más de 6 caracteres")
      }
    }
    if (data.get("oldPassword") == '')
    {
      return await setError("Introduce tu contraseña actual")
    }

    await setError('')
    if (data.get("email") != currentUser?.email)
    {
      const error_ = await updateUserEmail(data.get("email")!.toString(), data.get("oldPassword")!.toString())
      if (error_ != '') { return await setError(error_) }
    }
    if (data.get("newPassword") != '')
    {
      const error_ = await updateUserEmail(data.get("email")!.toString(), data.get("oldPassword")!.toString())
      if (error_ != '') { return await setError(error_) }
    }
    
    // Pop up exito
    setSuccess("Datos actualizados con éxito")
  }

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
              {error != '' ? <Alert severity="error">{error}</Alert> : ''}
              {success != '' ? <Alert severity="success">{success}</Alert> : ''}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                defaultValue={currentUser?.email}
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
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
                name="oldPassword"
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