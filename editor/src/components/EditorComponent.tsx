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
import { json, useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import axios from "axios";
import { getStorage, ref, uploadBytes, getBlob, getBytes, getStream } from "firebase/storage";
import SceneInterface from "../interfaces/SceneInterface"



function EditorComponent(scene: SceneInterface): JSX.Element {

  const [tipoEscena, setTipoEscena] = useState('Superficie')
  const [idEscena, setIdEscena] = useState('')
  const [nombreEscena, setNombreEscena] = useState('')
  const [imagenFile, setImagenFile] = useState<File | undefined>(undefined)
  const [soundFile, setSoundFile] = useState<File | undefined>(undefined)
  const [animaciones, setAnimaciones] = useState('No')

  const [reproduciendo, setReproduciendo] = useState(false)
  const [herrSelec, setHerramienta] = useState('translate')
  const [sceneController] = useState<SceneController>(new SceneController())
  const navigate = useNavigate();

  const sceneTypeHash = new Map<string, string>([
      ["Superficie", "ground"],
      ["Marcador", "augmented_images"],
      ["Geoespacial", "geospatial"]
    ]);

  const reverseTypeHash = new Map<string, string>([
    ["ground", "Superficie"],
    ["augmented_images", "Marcador"],
    ["geospatial", "Geoespacial"]
    ]);

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
    console.log("Entra en handler")
    console.log(selectorFiles[0].name.split(".").pop()!.toLowerCase())

    if (type.includes(selectorFiles[0].name.split(".").pop()!.toLowerCase())) {
      loadFile(selectorFiles[0], sceneLoad)
      console.log("Formato correcto")
      
    }
    else {
      console.log("Formato incorrecto")
    }
    
  }

  const loadFile = (file: File, sceneLoad: Boolean) => {
    const filename = file.name;
    const extension = filename.split(".").pop()!.toLowerCase();

    if (extension === "glb") {
      const url = URL.createObjectURL(file)
      if (sceneLoad) { sceneController.loadScene(url) }
      else { sceneController.loadModel(url) }
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
      loadFile(event.dataTransfer!.files[0], false)
    })
  }

  const exportScene = () => {
    sceneController.exportScene()
  }

  const saveScene = async () => {

    const json = JSON.parse(sceneController.generateJSON(nombreEscena, sceneTypeHash.get(tipoEscena)!, "", "", "", []))
    json.uid = window.localStorage.getItem('uid')

    if (animaciones == "No") { json.animations = [] }
    if (soundFile != undefined) { json.sound = "true" }
    if (imagenFile != undefined) { json.image_url = "true" }
    var id_escena = idEscena

    const token = window.localStorage.getItem('token')

    if (id_escena == "")
    {
      const res = await axios.post('http://localhost:5000/post/escenas', json, {
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
      console.log(res)
      id_escena = res.data.idscene
      setIdEscena(id_escena)
    }
    else {
      const res = await axios.put('http://localhost:5000/update/escenas/'+idEscena, json, {
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
    }

    const upload = async (modelFile: Blob) => {

      //Subir modelo
      const storage = getStorage();
      const storageRef = ref(storage, 'models/' + id_escena + '.glb');
      uploadBytes(storageRef, modelFile).then((snapshot) => {
        console.log('Uploaded a model file!');
      });


      //OPCIONAL subir musica
      if (soundFile != undefined)
      {
        const soundRef = ref(storage, 'audio/' + id_escena + '.mp3');
        uploadBytes(soundRef, soundFile).then((snapshot) => {
          console.log('Uploaded a sound file!');
        });
      }

      //OPCIONAL subir imagen
      if (imagenFile != undefined)
      {
        const imagenRef = ref(storage, 'images/' + id_escena + '.jpg');
        uploadBytes(imagenRef, imagenFile).then((snapshot) => {
          console.log('Uploaded a image file!');
        });
      }
    }

    console.log("antes del getSceneModel")
    var file = sceneController.getSceneModel(upload)
    console.log("fuera del getSceneModel")
  }

  const loadScene = async () => {
    console.log(scene.id)
    if (scene.id != "")
    {
      console.log("Cargando escen")
      setIdEscena(scene.id)

    // Establecer nomrbe
    setNombreEscena(scene.name)
    // Establecer tipo
    setTipoEscena(reverseTypeHash.get(scene.scene_type)!)
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
    if (scene.sound != "")
    {
      getBlob(ref(storage, scene.sound))
      .then((blob) => {
        const file = new File([blob], "audio.mp3")
        loadFile(file, true)
      })
    }
    
    // Cargar escena
    console.log(scene.model_url)
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
    <div className="editor-header">
      <div className="contenedor-botones-cabecera">
        <Button onClick={() => navigate('/')} variant="contained" color="primary" className="boton-atras" ><ArrowBackIcon/></Button>
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
