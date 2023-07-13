import { Stack, Button } from "@mui/material"
import { useAuth } from "../controller/userController";
import { useNavigate } from "react-router-dom";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface HeaderInterface {
    name: string,
    home: boolean
  }
export default function HeaderComponent(props: HeaderInterface) {

    const navigate = useNavigate()
    const {currentUser, logout} = useAuth()

    const logOut = () => {
        logout()
        navigate("/signin")
      }

    return (
        <>
            <div className="editor-header">
                <div className="general-header">
                {(!props.home) ? (
				    <div className="contenedor-botones-cabecera">
                        {/*<IconButton className="boton-volver" edge="start" size="large" onClick={() => {navigate("/")}}> <ArrowBackIcon/> </IconButton>*/}
                        <Button onClick={() => navigate('/')} variant="contained" color="primary" className="boton-atras" ><ArrowBackIcon/></Button>
                    </div>
                ) : (<></>)}
                    
                    <div className="center"> <p className="bienvenida-usuario">{props.name}</p> </div>
                </div>
                
                {(currentUser) ? (
				    <div className="contenedor-botones-cabecera">
                    <Stack spacing={2} direction="row">
                        <Button onClick={() => navigate('/config')} variant="contained" color="secondary" className="boton-guardado" endIcon={<ManageAccountsIcon />}>Ajustes</Button>
                        <Button onClick={() => logOut()} variant="contained" color="secondary" className="boton-guardado" endIcon={<LogoutIcon />}>Cerrar sesión</Button>
                    </Stack>     
                </div>
                ) : (<></>)}
                
            </div>
        </>
    )
}