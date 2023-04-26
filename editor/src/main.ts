import * as THREE from 'three'
import EditorScene from './EditorScene'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

const width = window.innerWidth
const height = window.innerHeight

// Creación del renderer
var renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('app') as HTMLCanvasElement
})
renderer.setSize(width, height)
renderer.setClearColor(new THREE.Color( 0x333333), 1)

// Creación de la cámara
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 500)
camera.position.set( 7, 10, 10 );

// Creación de la escena
const scene = new EditorScene()
scene.initialize()

// Creación de los controles de la cámara
const cameraControl = new OrbitControls (camera, renderer.domElement)
cameraControl.target = new THREE.Vector3(0, 0, 0)
cameraControl.mouseButtons = {
	MIDDLE: THREE.MOUSE.PAN,
	RIGHT: THREE.MOUSE.ROTATE
}
cameraControl.zoomSpeed = 2
cameraControl.update()

// Creación de los controles de transformación
const transformControls = new TransformControls(camera, renderer.domElement)
transformControls.setMode("translate")
scene.add(transformControls)

// Raycaster para selección con el ratón
const raycaster: THREE.Raycaster = new THREE.Raycaster
const raycasterHelper: THREE.Raycaster = new THREE.Raycaster
const mouse: THREE.Vector2 = new THREE.Vector2(1, 1)

// Definicion de listeners
document.addEventListener( 'mousemove', onMouseMove );
window.addEventListener( 'resize', onWindowResize );
window.addEventListener( 'mousedown', onMouseDown );
window.addEventListener( 'keydown', onKeyDown );
window.addEventListener( 'keyup', onKeyUp );

let key_pressed: { [key: string]: boolean } = {}

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
  if (e.button == 0) {
    raycaster.setFromCamera( mouse, camera );
    const intersection = raycaster.intersectObjects( scene.getObjectArray(), true)
    
     if (intersection.length > 0 && !transformControls.dragging) {

      scene.selectObject(intersection[0].object)
      transformControls.attach(scene.getSelectGroup())
      
      if (key_pressed['d']){
        transformControls.detach()
        scene.removeObject(intersection[0].object)
      }
    }
    
    else if (!transformControls.dragging){
      transformControls.detach()
      scene.unSelectAll()
    }
  }
  
}

function onKeyDown(ev : any)
{
  key_pressed[ev.key.toLowerCase()] = true;

  if (key_pressed['i']) {
    transformControls.setMode("translate")
  }

  if (key_pressed['o']) {
    transformControls.setMode("rotate")
  }

  if (key_pressed['p']) {
    transformControls.setMode("scale")
  }
}

function onKeyUp(ev : any)
{
  key_pressed[ev.key.toLowerCase()] = false;

}

update()