import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import '../styles/SceneList.css'
import SceneListItem from "./SceneListItem";

function SceneList() {


  return (
    <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}
    >
        <SceneListItem/>
        <SceneListItem/>
        <SceneListItem/>
        <SceneListItem/>
        <SceneListItem/>
        <SceneListItem/>
        <SceneListItem/>
        <SceneListItem/>
    </Grid>
    
  )
}

export default SceneList