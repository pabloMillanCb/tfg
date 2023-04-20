import * as THREE from 'three'
import EditorScene from './EditorScene'

const width = window.innerWidth
const height = window.innerHeight

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('app') as HTMLCanvasElement
})
renderer.setSize(width, height)
renderer.setClearColor(new THREE.Color( 0x333333), 1)

const mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)

const scene = new EditorScene()
scene.initialize()



function tick() 
{
  scene.update()
  renderer.render(scene, mainCamera)
  requestAnimationFrame(tick)
}

tick()