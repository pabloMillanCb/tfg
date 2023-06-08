import * as THREE from "three"
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import EditorScene from "./EditorScene"

class SceneController {

    private width : number
    private height : number

    // Creación del renderer
    private renderer :THREE.WebGLRenderer

    // Creación de la cámara
    private camera :THREE.PerspectiveCamera

    // Creación de la escena
    private scene : EditorScene
    
    // Creación de los controles de la cámara
    private cameraControl : OrbitControls

    // Creación de los controles de transformación
    private transformControls : TransformControls

    // Raycaster para selección con el ratón
    private raycaster: THREE.Raycaster
    private mouse: THREE.Vector2

    private key_pressed: { [key: string]: boolean }

    //const newInput: HTMLElement = document.getElementById("newFile")!;

    private delete_mode: boolean = false

    private audio: HTMLAudioElement = new Audio()

    private animationButton: HTMLElement|null

    constructor() {

      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.animationButton = null

      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor(new THREE.Color(0x282828), 1);

      this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 500);
      this.camera.position.set(7, 10, 10);

      this.cameraControl = new OrbitControls(this.camera, this.renderer.domElement);
      this.cameraControl.target = new THREE.Vector3(0, 0, 0);
      this.cameraControl.mouseButtons = {
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.ROTATE,
      };
      this.cameraControl.zoomSpeed = 2;
      this.cameraControl.update();
      this.transformControls = new TransformControls(
        this.camera,
        this.renderer.domElement
      );
      this.transformControls.setMode("translate");
      
      this.scene = new EditorScene()
      this.scene.initialize()
      
      this.scene.add(this.transformControls);

      this.key_pressed = {}
      this.mouse = new THREE.Vector2(1, 1);
      this.raycaster = new THREE.Raycaster();
    }

    setCanvas = (): void => {

      this.animationButton = document.getElementById("contenedor-boton-animaciones")!

      this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 500);
      this.camera.position.set(7, 10, 10);

      this.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("threeCanvas") as HTMLCanvasElement,
      })
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor(new THREE.Color(0x282828), 1);

      this.cameraControl = new OrbitControls(this.camera, this.renderer.domElement);
      this.cameraControl.target = new THREE.Vector3(0, 0, 0);
      this.cameraControl.mouseButtons = {
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.ROTATE,
      };
      this.cameraControl.zoomSpeed = 2;
      this.cameraControl.update();
      this.transformControls = new TransformControls(
        this.camera,
        this.renderer.domElement
      );
      this.transformControls.setMode("translate");
      this.scene.add(this.transformControls);

      // Definicion de listeners
      document.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("resize", this.onWindowResize);
      document.getElementById("threeCanvas")!.addEventListener("mousedown", this.onMouseDown);
      window.addEventListener("keyup", this.onKeyUp);
    }

    // Función para refrescar cada frame
    update = (): void => {
      this.scene.update();

      this.cameraControl.update();

      requestAnimationFrame(this.update);

      this.renderer.render(this.scene, this.camera);
    }

    setMode = (mode: string): void => {

      if (mode == "delete") {
        this.delete_mode = true
      }

      else if (mode == "translate" || mode == "rotate" || mode == "scale") {
        this.delete_mode = false
        this.transformControls.setMode(mode)
      }
    }

    // Funciones para la interacción por teclado y ratón

    onMouseMove = (event: any): void => {
      event.preventDefault();

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onWindowResize = (): void => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseDown = (e: any): void => {
      this.animationButton!.style.display = "none"
      // Selección de objeto con raycaster
      if (e.button == 0) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersection = this.raycaster.intersectObjects(
          this.scene.getObjectArray(),
          true
        )

        if (intersection.length > 0 && !this.transformControls.dragging) {
          if (!this.key_pressed["control"]) {
            this.scene.unSelectAll()
          }

          this.scene.selectObject(intersection[0].object);
          this.transformControls.attach(this.scene.getSelectGroup());
          console.log(this.scene.getSelectGroup().animations.length)
          if (this.scene.getSelectGroup().animations.length > 0)
          {
            console.log(document.getElementById("contenedor-boton-animaciones")!.style.display)
            this.animationButton!.style.display = "flex"
          }
          else {
            this.animationButton!.style.display = "none"
          }
          

          // Función de eliminar
          if (this.delete_mode) {
            this.transformControls.detach();
            this.scene.removeObject(intersection[0].object);
          }
        }

        // Si no se clica nada y no se está arrastrando, deseleccionar
        else if (!this.transformControls.dragging) {
          this.transformControls.detach()
          this.scene.unSelectAll()
        }
      }
    }

    onKeyUp = (ev: any): void => {
      this.key_pressed[ev.key.toLowerCase()] = false;
    }

    loadScene(url: string) {
      this.scene.loadScene(url)
    }

    loadModel(url: string) {
      this.scene.loadModel(url)
    }

    loadAudio(url: string) {
      this.audio = new Audio(url)
    }

    playAudio() {
      this.audio.play()
    }

    stopAudio() {
      this.audio.pause()
      this.audio.currentTime = 0
    }

    playAnimation() {
      this.scene.playAnimations()
    }

    stopAnimation() {
      this.scene.stopAnimation()
    }

    exportScene() {
      this.scene.exportScene()
    }

    generateJSON(name: String, typeScene: String) {

      var modelJSON = []

      const sceneJSON = {
        "name": name,
        "scene_type": typeScene,
        "sound": "sonido",
        "loop": true,
        "image_url": "http",
        "coordinates" : "",
        "longitud" : "",
        "altura" : "",

        "models": this.scene.getModelJson().models
      }

    }

}

export default SceneController