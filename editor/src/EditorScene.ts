import * as THREE from 'three'
import { Box3, Object3D } from 'three';


export default class EditorScene extends THREE.Scene
{

    // Lista de objetos en la escena
    private liveObjects: THREE.Group = new THREE.Group
    private selectedObject: THREE.Object3D = new THREE.Object3D

    initialize()
    {
        var cube: THREE.Object3D = new THREE.Object3D() 
        const edges = new THREE.EdgesGeometry( new THREE.BoxGeometry() );
        cube.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({color: 0xFFAD00})))
        cube.position.y = 0.5
        cube.position.x = -3
        cube.position.z = -1

        var sphere: THREE.Object3D = new THREE.Object3D() 
        sphere.add(new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshPhongMaterial({color: 0xFFAD00})))
        sphere.position.y = 0.5
        sphere.position.x = 1
        sphere.position.z = 3

        this.addObjetct(cube)
        this.addObjetct(sphere)

        this.add(this.liveObjects)

        this.createBasics()
    }

    update()
    {
        console.log("live: "+this.liveObjects.children.length)
        console.log("scene: "+this.children.length)
    }

    createBasics()
    {
        // Luz
        const light = new THREE.DirectionalLight(0xFFFFFF, 1)
        light.position.set(0, 4, 2)
        this.add(light)

        // Suelo de referencia
        const gridHelper = new THREE.GridHelper( 10, 10 );
        gridHelper.position.z = 0.1
        this.add( gridHelper );

        // Ejes de referencia
        const axesHelper = new THREE.AxesHelper( 2 );
        this.add( axesHelper );
    }

    addObjetct(obj: THREE.Object3D)
    {
        obj.name = "alive"
        this.liveObjects.add(obj)
    }

    removeObject(obj: THREE.Object3D)
    {
        while (obj.name != "alive"){

            obj = obj.parent!
        }
        
        obj.removeFromParent()
    }

    getObjectArray():THREE.Object3D[]
    {
        return this.liveObjects.children
    }

    getSelectGroup(): THREE.Object3D
    {
        return this.selectedObject
    }

    selectObject(obj: THREE.Object3D)
    {
        while (obj.name != "alive"){

            obj = obj.parent!
        }

        this.selectedObject = obj
    }

    unSelectAll()
    {
        this.selectedObject = new THREE.Object3D
    }

}