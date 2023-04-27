import * as THREE from 'three'
import EditorScene from './EditorScene'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

const width = window.innerWidth
const height = window.innerHeight

// Creación del renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('app') as HTMLCanvasElement
})

// Creación de la cámara
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 500)


// Creación de la escena
const scene = new EditorScene()
scene.initialize()

// Creación de los controles de la cámara
const cameraControl = new OrbitControls (camera, renderer.domElement)

// Creación de los controles de transformación
const transformControls = new TransformControls(camera, renderer.domElement)


// Raycaster para selección con el ratón
const raycaster: THREE.Raycaster = new THREE.Raycaster
const mouse: THREE.Vector2 = new THREE.Vector2(1, 1)

// Carga de modelos locales
const inputElement : HTMLElement = document.getElementById("glbfile")!

let key_pressed: { [key: string]: boolean } = {}

const newInput : HTMLElement = document.getElementById("newFile")!




function init(){

  renderer.setSize(width, height)
  renderer.setClearColor(new THREE.Color( 0x333333), 1)

  camera.position.set( 7, 10, 10 );

  cameraControl.target = new THREE.Vector3(0, 0, 0)
  cameraControl.mouseButtons = {
    MIDDLE: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE
  }
  cameraControl.zoomSpeed = 2
  cameraControl.update()

  transformControls.setMode("translate")
  scene.add(transformControls)

  // Definicion de listeners
  document.addEventListener( 'mousemove', onMouseMove );
  window.addEventListener( 'resize', onWindowResize );
  window.addEventListener( 'mousedown', onMouseDown );
  window.addEventListener( 'keydown', onKeyDown );
  window.addEventListener( 'keyup', onKeyUp );
  
  inputElement?.addEventListener("change", handleFiles, false);

  newInput.onclick = function(){
    document.getElementById("glbfile")!.style.display = "block";
    document.getElementById("newFile")!.style.display = "none";
  }


  initDragAndDrop()
}

// Función para refrescar cada frame
function update() 
{
  scene.update()

  cameraControl.update()

  requestAnimationFrame(update)

  renderer.render(scene, camera)
}

// Funciones para la interacción por teclado y ratón

function onMouseMove( event : any )
{
  event.preventDefault();

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onWindowResize()
{

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onMouseDown( e : any )
{
  // Selección de objeto con raycaster
  if (e.button == 0) 
  {
    raycaster.setFromCamera( mouse, camera );
    const intersection = raycaster.intersectObjects( scene.getObjectArray(), true)
    
     if (intersection.length > 0 && !transformControls.dragging)
     {

      if (!key_pressed['control'])
      {
        scene.unSelectAll()
      }

      scene.selectObject(intersection[0].object)
      transformControls.attach(scene.getSelectGroup())
      
      // Función de eliminar
      if (key_pressed['d'])
      {
        transformControls.detach()
        scene.removeObject(intersection[0].object)
      }
    }
    
    // Si no se clica nada y no se está arrastrando, deseleccionar
    else if (!transformControls.dragging)
    {
      transformControls.detach()
      scene.unSelectAll()
    }
  }
  
}

// PROVISIONAL: Cambio de modo
function onKeyDown(ev : any)
{
  key_pressed[ev.key.toLowerCase()] = true;

  if (key_pressed['i']) 
  {
    transformControls.setMode("translate")
  }

  if (key_pressed['o']) 
  {
    transformControls.setMode("rotate")
  }

  if (key_pressed['p']) 
  {
    transformControls.setMode("scale")
  }
}

function onKeyUp(ev : any)
{
  key_pressed[ev.key.toLowerCase()] = false;

}

function loadFile( file : File, scene : EditorScene) {

  const filename = file.name;
  const extension = filename.split( '.' ).pop()!.toLowerCase();

  if ( extension === 'glb' ) {

    console.log("Leido archivo " + file.name)
    const url = URL.createObjectURL(file);
    console.log("url " + url)
    scene.loadModel(url)

    document.getElementById("glbfile")!.style.display = "none";
    document.getElementById("newFile")!.style.display = "block";

    } else { 

      console.log("Formato de archivo equivocado")

    }

}

function initDragAndDrop() {

  document.addEventListener( 'dragover', function ( event : any ) {

    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';

  } );

  document.addEventListener( 'drop', function ( event : any ) {

    event.preventDefault();

    loadFile( event.dataTransfer!.files[0], scene );

  } );

}

function handleFiles(e: Event) {
  //const fileList = this.files; /* now you can work with the file list */
  let file = (<HTMLInputElement>e.target).files![0];
  loadFile(file, scene)
}

init()
update()