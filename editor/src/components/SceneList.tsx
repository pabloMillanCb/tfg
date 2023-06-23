import { Stack, Button, Grid} from "@mui/material"
import '../styles/SceneList.css'
import SceneListItem from "./SceneListItem";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SceneInterface from "../interfaces/SceneInterface"
import Loader from "./Loader";

interface SceneListInterface {
  setScene: (s: SceneInterface) => void
}


function SceneList(props: SceneListInterface) {

  const navigate = useNavigate();
  const [listaEscenas, setListaEscenas] = useState<SceneInterface[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    fetchScenes()
          
  }, []);
  
  const fetchScenes = async () => {
    const token = window.localStorage.getItem('token')
    const res = await axios.get('http://localhost:5000/get/escenas/'+window.localStorage.getItem('uid'), {
        headers: {
          Authorization: 'Bearer ' + token,
  
        },
      })
      await setListaEscenas(res.data)
      setLoading(false)
  }

  const newScene = async () => {

    const newScene: SceneInterface = {
      "id": "",
      "name": "",
      "scene_type": "",
      "sound": "",
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
    <Loader loading={loading}/>
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