import Box from "@mui/material/Box"
import '../styles/SceneList.css'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface SceneItemInterface {
  name: string,
  type: string,
  id : string
}

function SceneListItem(props: SceneItemInterface) {

  const navigate = useNavigate();

  function getTypeVerbose(type: string)
  {
    if (type == "augmented_images")
    {
      return "Escena por marcador"
    }
    if (type == "ground")
    {
      return "Escena por superficies"
    }
    if (type == "geospatial")
    {
      return "Escena geoespacial"
    }
  }

  console.log(getTypeVerbose('augmented_images'))


  return (
    <>
        <Box
          sx={{  
            marginTop: 0,
            alignItems: "start",
            width: '80%',
          }}
        >
            <div className="scene-list-item-container">
                <div className="titulo-tipo">
                  <p className="titulo-escena">{props.name}</p>
                  <p className="tipo-escena">{getTypeVerbose(props.type)}</p>
                </div>
                <div className="botones-escena">
                  <div>
                    <Button className="boton-seleccion-escena" onClick={() => {navigate("/editor")}} variant="contained" endIcon={<EditIcon />}>Editar</Button>
                  </div>
                  <div>
                    <Button className="boton-seleccion-escena" variant="contained" color="error" endIcon={<DeleteIcon />}>Eliminar</Button>
                  </div>
                </div>
            </div>
        </Box>
    </>
  )
}

export default SceneListItem