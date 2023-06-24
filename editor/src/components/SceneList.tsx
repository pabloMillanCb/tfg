import { Stack, Button, Grid} from "@mui/material"
import '../styles/SceneList.css'
import SceneListItem from "./SceneListItem";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SceneInterface from "../interfaces/SceneInterface"
import Loader from "./Loader";
import { useAuth } from "../controller/userController";
import { useScn } from "../controller/sceneController";

interface SceneListInterface {
  setScene: (s: SceneInterface) => void
}


function SceneList(props: SceneListInterface) {

  const navigate = useNavigate();
  const [listaEscenas, setListaEscenas] = useState<SceneInterface[]>([])
  const {setLoading} = useScn()
  
  const { getScenesFromUser } = useScn()

  useEffect(() => {
    fetchScenes()
  }, []);
  
  const fetchScenes = async () => {
    setLoading(true)
    const data = await getScenesFromUser()
    await setListaEscenas(data)
    setLoading(false)
  }

  const newScene = async () => {

    const newScene: SceneInterface = {
      "id": "",
      "name": "",
      "scene_type": "",
      "audio": "",
      "loop": true,
      "image_url": "",
      "coordinates": [],
      "model_url": "",
      "animations" : []
    }

    await props.setScene(newScene)

    navigate('/editor')
  }

  return (
    <>
    <div className="contenedor-nueva-escena">
      <Button onClick={newScene} variant="contained" color="primary" className="boton-atras" endIcon={<AddIcon/>} >Nueva escena</Button>
    </div>
      
      <Grid
          container
          marginTop={0}
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="start"
          sx={{ minHeight: '100vh' }}
      >
          {
          listaEscenas.map(function(object, i){
            return <SceneListItem setScene={props.setScene} scene={object} key={i} />;
          })}

      </Grid>
    </>
  )
}

export default SceneList