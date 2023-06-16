import { useEffect, useState } from "react"
import SceneController from "./Scene/SceneController"
import "../styles/EditorComponent.css"
import { Stack, Button, IconButton, TextField, Select, MenuItem, InputLabel, FormControl, Box, SelectChangeEvent} from "@mui/material"
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import OpenWithIcon from '@mui/icons-material/OpenWith';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function EditorComponent(): JSX.Element {

  const [tipoEscena, setTipoEscena] = useState('Superficie')
  const [reproduciendo, setReproduciendo] = useState(false)
  const [animaciones, setAnimaciones] = useState('No')
  const [herrSelec, setHerramienta] = useState('translate')
  const [sceneController] = useState<SceneController>(new SceneController())

  const handlePlay = (playing: boolean) => {

    setReproduciendo(playing)

    if (playing){
      sceneController.playAudio()
      if (animaciones == "Si") {
        sceneController.playAnimation()
      }
    }
    else {
      sceneController.stopAudio()
      sceneController.stopAnimation()
    }
  }

  const handleTipoEscena = (event: SelectChangeEvent) => {

    setTipoEscena(event.target.value as string);
    sceneController.manageImage(event.target.value as string)

    if (event.target.value as string == "Marcador"){
      document.getElementById("subir-imagen")!.style.display = "flex"
      document.getElementById("coordenadas")!.style.display = "none"
    }

    else if (event.target.value as string == "Geoespacial"){
      document.getElementById("subir-imagen")!.style.display = "none"
      document.getElementById("coordenadas")!.style.display = "flex"
    }

    else {
      document.getElementById("subir-imagen")!.style.display = "none"
      document.getElementById("coordenadas")!.style.display = "none"
    }
  }

  const handleAnimaciones = (event: SelectChangeEvent) => {
    if (animaciones == 'Si'){
      sceneController.stopAnimation()
    }
    setAnimaciones(event.target.value as string);
  }

  const handleTools = (mode : string) => {
    setHerramienta(mode)
    sceneController.setMode(mode)
  }

  useEffect(() => {

    initDragAndDrop()
    sceneController.setCanvas()
    sceneController.update()
  }, []);

  const handleLoad = (selectorFiles: FileList, type: string[], sceneLoad: Boolean) => {
    console.log("Entra en handler")
    console.log(selectorFiles[0].name.split(".").pop()!.toLowerCase())

    if (type.includes(selectorFiles[0].name.split(".").pop()!.toLowerCase())) {
      loadFile(selectorFiles[0], sceneController, sceneLoad)
      console.log("Formato correcto")
      
    }
    else {
      console.log("Formato incorrecto")
    }
    
  }

  const loadFile = (file: File, controller: SceneController, sceneLoad: Boolean) => {
    const filename = file.name;
    const extension = filename.split(".").pop()!.toLowerCase();

    console.log("Entrando en loadfile")

    if (extension === "glb") {
      const url = URL.createObjectURL(file)
      if (sceneLoad) { controller.loadScene(url) }
      else { controller.loadModel(url) }
    } 

    else if (extension === "mp3" || extension === "ogg") {
      const url = URL.createObjectURL(file)
      controller.loadAudio(url)
    }

    else if (extension === "jpg" || extension === "png" || extension === "svg") {
      const url = URL.createObjectURL(file)
      controller.loadImage(url)
    }
    
    else {
      console.log("Formato de archivo equivocado")
    }
  }

  const initDragAndDrop = () => {
    document.addEventListener("dragover", function (event: any) {
      event.preventDefault();
      event.dataTransfer!.dropEffect = "copy";
    });

    document.addEventListener("drop", function (event: any) {
      event.preventDefault();
      loadFile(event.dataTransfer!.files[0], sceneController, false)
    })
  }

  const exportScene = () => {
    console.log("exportando")
    sceneController.exportScene()
  }

  const changeAnimation = () => {
    sceneController.changeAnimationSelectedObjects()
  }

  const generateJSON = () => {
    sceneController.generateJSON("nomber", tipoEscena)
  }

  return (
    <div className="main-div">
      <div className="editor-header">
      <div className="contenedor-botones-cabecera">
        <IconButton className="boton-volver"> <ArrowBackIcon/> </IconButton>
      </div>
      
        <div className="contenedor-titulo">
          <TextField id="titulo" label="Nombre de escena" variant="standard"/>
        </div>
        <div className="contenedor-botones-cabecera">
          <Stack spacing={2} direction="row">
            <Button onClick={() => exportScene()} variant="contained" color="secondary" className="boton-guardado" endIcon={<SaveAltIcon />}>Exportar</Button>
            <Button onClick={() => generateJSON()} variant="contained" className="boton-guardado" endIcon={<CloudUploadIcon />}>Guardar</Button>
          </Stack>     
        </div>
      </div>

      <div className="cuerpo-editor">
        <div className="toolbar-editor">
          <div className="contenedor-herramientas">
              <IconButton className="boton-herramienta" size="large" color={herrSelec=="translate" ? "primary" : "default"} onClick={() => handleTools('translate')}> <OpenWithIcon/></IconButton>
              <IconButton className="boton-herramienta" size="large" color={herrSelec=="rotate" ? "primary" : "default"} onClick={() => handleTools('rotate')}> <Rotate90DegreesCcwIcon/></IconButton>
              <IconButton className="boton-herramienta" size="large" color={herrSelec=="scale" ? "primary" : "default"} onClick={() => handleTools('scale')}> <AspectRatioIcon/></IconButton>
              <IconButton className="boton-herramienta" size="large" color={herrSelec=="delete" ? "primary" : "default"} onClick={() => handleTools('delete')}> <DeleteIcon/></IconButton>
              <IconButton className="boton-play" size="large" color="success" onClick={() => handlePlay(!reproduciendo)}> {reproduciendo ? <PauseCircleFilledIcon/> : <PlayCircleFilledIcon/>}</IconButton>
          </div>
          <div className="contenedor-subir-archivo">
            <Button variant="contained" component="label" color="secondary">
              Cargar modelo
              <input hidden multiple type="file" onChange={ (e) => handleLoad(e.target.files as FileList, ["glb"], false) }/>
            </Button>
          </div>
          <div className="contenedor-subir-archivo">
            <Button variant="contained" component="label" color="secondary">
              Cargar Escena
              <input hidden multiple type="file" onChange={ (e) => handleLoad(e.target.files as FileList, ["glb"], true) }/>
            </Button>
          </div>
          <div className="contenedor-subir-archivo">
            <Button variant="contained" component="label" color="secondary">
              Cargar audio
              <input hidden multiple type="file" onChange={ (e) => handleLoad(e.target.files as FileList, ["mp3", "ogg"], false) } />
            </Button>
          </div>
          <div className="contenedor-selector">
            <>
            <Box sx={{ minWidth: 200 }}>
              <FormControl fullWidth>
              <InputLabel id="activar-animaciones" >Animaciones</InputLabel>
              
              <Select
                id="seleccion-animaciones"
                value={animaciones}
                label="Animaciones"
                onChange={handleAnimaciones}
              >
                <MenuItem value={"Si"}>Si</MenuItem>
                <MenuItem value={"No"}>No</MenuItem>
              </Select>
              </FormControl>
            </Box>
            </>
            
          </div>

          <div id="contenedor-boton-animaciones">
            <Button onClick={() => changeAnimation()} variant="contained" component="label" color="secondary">Cambiar Animación</Button>
          </div>

          <div className="contenedor-selector">
            <>
            <Box sx={{ minWidth: 200 }}>
              <FormControl fullWidth>
              <InputLabel id="tipo-escena" >Tipo de escena</InputLabel>
              <Select
                id="seleccion-escena"
                value={tipoEscena}
                label="Tipo de escena"
                onChange={handleTipoEscena}
              >
                <MenuItem value={"Marcador"}>Marcador</MenuItem>
                <MenuItem value={"Superficie"}>Superficie</MenuItem>
                <MenuItem value={"Geoespacial"}>Geoespacial</MenuItem>
              </Select>
              </FormControl>
            </Box>
            </>
          </div>
          <div className="contenedor-subir-imagen" id="subir-imagen">
            <Button variant="contained" component="label" id="boton-carga-imagen" color="secondary">
              Cargar imagen
              <input hidden type="file" onChange={ (e) => handleLoad(e.target.files as FileList, ["png", "jpg", "svg"], false) }/>
            </Button>
          </div>
          <div className="contenedor-coordenadas" id="coordenadas">
            <TextField id="latitud" label="Latitud" variant="standard" type="number"/>
            <TextField id="longitud" label="Longitud" variant="standard" type="number"/>
            <TextField id="altura" label="Altura" variant="standard" type="number"/>
          </div>
        </div>
        <canvas id="threeCanvas" />
      </div>
    </div>
  );
}

export default EditorComponent;
