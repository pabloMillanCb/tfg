import { useEffect, useState } from "react"
import EditorSceneController from "./Scene/EditorSceneController";
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
import { json, useNavigate } from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';
import HomeIcon from '@mui/icons-material/Home';
import axios from "axios";
import { getStorage, ref, uploadBytes, getBlob, getBytes, getStream } from "firebase/storage";
import SceneInterface from "../interfaces/SceneInterface"
import Loader from "./Loader";
import { useAuth } from "../controller/userController";
import { useScn } from "../controller/sceneController";
import ModalComponent from "./ModalComponent";
import { useLoading } from "../controller/loadingController";


function EditorComponent(scene: SceneInterface): JSX.Element {

  const sceneTypeHash = new Map<string, string>([
    ["Superficie", "ground"],
    ["Marcador", "augmented_images"],
    ["Geoespacial", "geospatial"]
  ]);

  const reverseTypeHash = new Map<string, string>([
    ["ground", "Superficie"],
    ["augmented_images", "Marcador"],
    ["geospatial", "Geoespacial"],
    ["", "Superficie"]
    ]);

  //const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()
  const { uploadScene } = useScn()
  const { loading, setLoading } = useLoading()


  const [tipoEscena, setTipoEscena] = useState(reverseTypeHash.get(scene.scene_type)!)
  const [idEscena, setIdEscena] = useState('')
  const [nombreEscena, setNombreEscena] = useState('')
  const [imagenFile, setImagenFile] = useState<File | undefined>(undefined)
  const [soundFile, setSoundFile] = useState<File | undefined>(undefined)
  const [animaciones, setAnimaciones] = useState('No')

  const [openModal, setOpenModal] = useState(false)

  const [reproduciendo, setReproduciendo] = useState(false)
  const [herrSelec, setHerramienta] = useState('translate')
  const [sceneController] = useState<EditorSceneController>(new EditorSceneController())
  const navigate = useNavigate();

  useEffect(() => {

    initDragAndDrop()
    sceneController.setCanvas()
    sceneController.update()
    loadScene()
  }, []);

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

  const handleNombreEscena = (event: string) => {
    setNombreEscena(event)
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

  const handleLoad = (selectorFiles: FileList, type: string[], sceneLoad: Boolean) => {
    if (type.includes(selectorFiles[0].name.split(".").pop()!.toLowerCase())) {
      loadFile(selectorFiles[0], sceneLoad)
    }
    // TODO Aviso para formatos equivocados
  }

  const loadFile = async (file: File, sceneLoad: Boolean) => {
    const filename = file.name;
    const extension = filename.split(".").pop()!.toLowerCase();

    if (extension === "glb") {
      const url = URL.createObjectURL(file)
      setLoading(true)
      if (sceneLoad) { sceneController.loadScene(url, setLoading) }
      else { sceneController.loadModel(url, setLoading) }
    } 

    else if (extension === "mp3" || extension === "ogg") {
      const url = URL.createObjectURL(file)
      setSoundFile(file)
      sceneController.loadAudio(url)
    }

    else if (extension === "jpg" || extension === "png" || extension === "svg") {
      const url = URL.createObjectURL(file)
      setImagenFile(file)
      sceneController.loadImage(url)
      sceneController.manageImage(tipoEscena as string)
    }
    
    else {
    }
  }

  const initDragAndDrop = () => {
    document.addEventListener("dragover", function (event: any) {
      event.preventDefault();
      event.dataTransfer!.dropEffect = "copy";
    });

    document.addEventListener("drop", function (event: any) {
      event.preventDefault();
      loadFile(event.dataTransfer!.files[0], false)
    })
  }

  const exportScene = () => {
    sceneController.exportScene()
  }

  const saveScene = async () => {

    console.log(sceneTypeHash.get(tipoEscena)!)
    const json = JSON.parse(sceneController.generateJSON(nombreEscena, sceneTypeHash.get(tipoEscena)!, "", "", "", []))
    json.uid = currentUser?.uid

    if (animaciones == "No") { json.animations = [] }
    if (soundFile != undefined) { json.audio = "true" }
    if (imagenFile != undefined) { json.image_url = "true" }

    const upload = async (modelFile: Blob) => {
      const id = await uploadScene(idEscena, JSON.stringify(json), modelFile, imagenFile, soundFile)
      setIdEscena(id)
    }

    sceneController.getSceneModel(upload)
  }

  const loadScene = async () => {
    if (scene.id != "")
    {
      setLoading(true)
      setIdEscena(scene.id)

    // Establecer nomrbe
    setNombreEscena(scene.name)
    // Establecer tipo
    await setTipoEscena(reverseTypeHash.get(scene.scene_type)!)
    // Establecer animaciones
    setAnimaciones(scene.animations.length > 0 ? "Si" : "No")

    const storage = getStorage();

    // Cargar imagen
    if (scene.image_url != "")
    {
      getBlob(ref(storage, scene.image_url))
      .then((blob) => {
        const file = new File([blob], "imagen.png")
        loadFile(file, true)
      })
    }
    
    // Cargar musica
    if (scene.audio != "")
    {
      getBlob(ref(storage, scene.audio))
      .then((blob) => {
        const file = new File([blob], "audio.mp3")
        loadFile(file, true)
      })
    }
    
    // Cargar escena
    getBlob(ref(storage, scene.model_url))
      .then((blob) => {
        const file = new File([blob], "scene.glb")
        loadFile(file, true)
      })
    }

  }

  const changeAnimation = () => {
    sceneController.changeAnimationSelectedObjects()
  }


  return (
    <div className="main-div">
      <ModalComponent 
          tittle={"¿Quieres salir del editor?" }
          text="Perderás los cambios no guardados en la escena" 
          fun={() => navigate('/')}
          open={openModal && !loading}
          textButton="Salir"
          onClose={() => setOpenModal(false)}
          color="error"
        />
    <div className="editor-header">
      <div className="contenedor-botones-cabecera">
        <Button onClick={() => setOpenModal(true)} variant="contained" color="primary" className="boton-atras" ><ArrowBackIcon/></Button>
      </div>
      
        <div className="contenedor-titulo">
          <TextField onChange={(e) => {handleNombreEscena(e.target.value)}} defaultValue={scene.name} id="titulo" label="Nombre de escena" variant="standard"/>
        </div>
        <div className="contenedor-botones-cabecera">
          <Stack spacing={2} direction="row">
            <Button onClick={() => exportScene()} variant="contained" color="secondary" className="boton-guardado" endIcon={<SaveAltIcon />}>Exportar</Button>
            <Button onClick={() => saveScene()} variant="contained" className="boton-guardado" endIcon={<CloudUploadIcon />}>Guardar</Button>
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
              Cargar audio
              <input hidden multiple type="file" onChange={ (e) => handleLoad(e.target.files as FileList, ["mp3", "ogg"], false) } />
            </Button>
          </div>
          <div className="contenedor-eliminar-audio">
            { soundFile != undefined &&
            <>
              <div className="center"><p>Eliminar</p></div>
              <div className="center">
                <IconButton className="boton-eliminar" size="small" color="error" onClick={() => setSoundFile(undefined)} > <ClearIcon/></IconButton>
              </div>
            </>
            }
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
