import * as THREE from 'three'
import { Box3, Object3D } from 'three';


export default class EditorScene extends THREE.Scene
{

    // Lista de objetos en la escena
    private liveObjects: THREE.Group = new THREE.Group
    private selectionHelper: THREE.Object3D = new THREE.Object3D
    private selectionHelperAux: THREE.Object3D = new THREE.Object3D
    private selectedList: THREE.Object3D[] = []

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

        this.addObject(cube)
        this.addObject(sphere)

        this.add(this.liveObjects)
        this.add(this.selectionHelper)

        this.createBasics()
    }

    update()
    {
        if (this.selectedList.length >= 2)
        {
            let position = {x: this.selectionHelper.position.x - this.selectionHelperAux.position.x,
                            y: this.selectionHelper.position.y - this.selectionHelperAux.position.y,
                            z: this.selectionHelper.position.z - this.selectionHelperAux.position.z}
            let rotation = {x: this.selectionHelper.rotation.x - this.selectionHelperAux.rotation.x,
                            y: this.selectionHelper.rotation.y - this.selectionHelperAux.rotation.y,
                            z: this.selectionHelper.rotation.z - this.selectionHelperAux.rotation.z}
            let scale = {x: this.selectionHelper.scale.x - this.selectionHelperAux.scale.x,
                        y: this.selectionHelper.scale.y - this.selectionHelperAux.scale.y,
                        z: this.selectionHelper.scale.z - this.selectionHelperAux.scale.z}

            for (let i = 0; i < this.selectedList.length; i++)
            {
                this.transformObject(this.selectedList[i], "translate", position.x, position.y, position.z)
                this.transformObject(this.selectedList[i], "rotate", rotation.x, rotation.y, rotation.z)
                this.transformObject(this.selectedList[i], "scale", scale.x, scale.y, scale.z)
            }

            this.selectionHelperAux.copy(this.selectionHelper)
        }

        
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

    addObject(obj: THREE.Object3D)
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
        if (this.selectedList.length < 2)
        {
            return this.selectedList[0]
        }
        else
        {
            console.log("devuelve grupo")
            return this.selectionHelper
        }
        
    }

    selectObject(obj: THREE.Object3D)
    {
        while (obj.name != "alive"){

            obj = obj.parent!
        }

        this.selectionHelper.removeFromParent()
        this.selectionHelper = new THREE.Object3D
        this.selectionHelperAux.copy(this.selectionHelper)
        this.add(this.selectionHelper)


        if (!this.selectedList.includes(obj))
        {
            this.selectedList.push(obj)
        }
        
        console.log("tamaño lista " + this.selectedList.length)
    }

    unSelectAll()
    {
        const n = this.selectionHelper.children.length
        for (let i = 0; i < n; i++)
        {
            let obj = this.selectionHelper.children[0]
            obj.removeFromParent()
            this.addObject(obj)
        }

        this.selectedList = []
    }

    transformObject(obj: THREE.Object3D, mode: string, x: number, y: number, z: number)
    {
        if (mode == "translate")
        {
            console.log("moviendo")
            obj.position.x += x
            obj.position.y += y
            obj.position.z += z
        }

        if (mode == "rotate")
        {
            obj.rotation.x += x
            obj.rotation.y += y
            obj.rotation.z += z
        }

        if (mode == "scale")
        {
            obj.scale.x += x
            obj.scale.y += y
            obj.scale.z += z
        }
    }

}