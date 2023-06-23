import Box from "@mui/material/Box"
import '../styles/SceneList.css'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SceneInterface from "../interfaces/SceneInterface"
import axios from "axios";

interface SceneListItemInterface {
  setScene: (s: SceneInterface) => void
  scene: SceneInterface
}

function SceneListItem(props: SceneListItemInterface) {

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

  const loadScene = async () => {

    await props.setScene(props.scene)

    navigate("/editor")
  }

  const deleteScene = async () => {

    const token = window.localStorage.getItem('token')
    const res = await axios.delete('http://localhost:5000/delete/escenas/'+props.scene.id, {
        headers: {
          Authorization: 'Bearer ' + token,
  
        },
      })

      window.location.reload()
  } 


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
                  <p className="titulo-escena">{props.scene.name}</p>
                  <p className="tipo-escena">{getTypeVerbose(props.scene.scene_type)}</p>
                </div>
                <div className="botones-escena">
                  <div>
                    <Button className="boton-seleccion-escena" onClick={loadScene} variant="contained" endIcon={<EditIcon />}>Editar</Button>
                  </div>
                  <div>
                    <Button className="boton-seleccion-escena" onClick={deleteScene} variant="contained" color="error" endIcon={<DeleteIcon />}>Eliminar</Button>
                  </div>
                </div>
            </div>
        </Box>
    </>
  )
}

export default SceneListItem