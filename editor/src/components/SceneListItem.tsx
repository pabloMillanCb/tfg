import Box from "@mui/material/Box"
import '../styles/SceneList.css'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SceneInterface from "../interfaces/SceneInterface"
import axios from "axios";
import { useScn } from "../controller/sceneController";
import ModalComponent from "./ModalComponent";
import { useState } from "react";

interface SceneListItemInterface {
  setScene: (s: SceneInterface) => void
  scene: SceneInterface
}

function SceneListItem(props: SceneListItemInterface) {

  const navigate = useNavigate()
  const { deleteScene} = useScn()
  const [openModal, setOpenModal] = useState(false)

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

  const handleDelete = async () => {

      await deleteScene(props.scene.id)
      window.location.reload()
  } 


  return (
    <>
        <ModalComponent 
          tittle={"¿Quieres eliminar la escena " + props.scene.name + "?" }
          text="No podrás recuperarla más tarde" 
          fun={() => handleDelete()}
          open={openModal}
          textButton="Eliminar"
          onClose={() => setOpenModal(false)}
          color="error"
        />
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
                    <Button className="boton-seleccion-escena" onClick={ () => setOpenModal(true) } variant="contained" color="error" endIcon={<DeleteIcon />}>Eliminar</Button>
                  </div>
                </div>
            </div>
        </Box>
    </>
  )
}

export default SceneListItem