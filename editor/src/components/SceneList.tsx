import { Stack, Button, IconButton, Grid, TextField, Select, MenuItem, InputLabel, FormControl, Box, SelectChangeEvent} from "@mui/material"
import '../styles/SceneList.css'
import SceneListItem from "./SceneListItem";
import { useNavigate } from "react-router-dom";

function SceneList() {

  const navigate = useNavigate();

  return (
    <>
      <Grid
          container
          marginTop={4}
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="start"
          sx={{ minHeight: '100vh' }}
      >
          <SceneListItem name="Nombre de Escena 1" type="augmented_images" id = "talcual"/>
          <SceneListItem name="Nombre  1" type="augmented_images" id = "talcual"/>
          <SceneListItem name="Nombre de Escenaaaaaaaaaaaaaaaaaaaaaaa 1" type="augmented_images" id = "talcual"/>
          <SceneListItem name="n" type="augmented_images" id = "talcual"/>
          <SceneListItem name="Nombre de Escena 1" type="augmented_images" id = "talcual"/>
          <SceneListItem name="Nombre de Escena 1" type="augmented_images" id = "talcual"/>
          <SceneListItem name="Nombre de Escena 1" type="augmented_images" id = "talcual"/>
      </Grid>
    </>
  )
}

export default SceneList