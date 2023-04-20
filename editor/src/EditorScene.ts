import * as THREE from 'three'

export default class EditorScene extends THREE.Scene
{
    private cube?: THREE.Mesh
    private objectList: THREE.Mesh[] = []

    initialize()
    {
        const geometry = new THREE.BoxGeometry()
        const material = new THREE.MeshPhongMaterial({color: 0xFFAD00})

        this.cube = new THREE.Mesh(geometry, material)
        this.cube.position.z = -5
        this.cube.position.y = -1

        this.add(this.cube)

        const light = new THREE.DirectionalLight(0xFFFFFF, 1)
        light.position.set(0, 4, 2)
        this.add(light)
    }

    update()
    {
        this.cube?.rotateY(0.05)
    }
}