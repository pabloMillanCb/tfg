import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';


export default class EditorScene extends THREE.Scene
{

    // Lista de objetos seleccionables en la escena
    private liveObjects: THREE.Group = new THREE.Group

    // Objetos seleccionados
    private selectedList: THREE.Object3D[] = []

    // Dummies para controlar las selecciones múltiples
    private selectionHelper: THREE.Object3D = new THREE.Object3D
    private selectionHelperAux: THREE.Object3D = new THREE.Object3D

    private mixer: THREE.AnimationMixer[] = []
    private clock = new THREE.Clock()

    private exporter: GLTFExporter = new GLTFExporter()
    

    initialize()
    {
        this.add(this.liveObjects)
        this.add(this.selectionHelper)

        this.liveObjects.name = "arliveobjects"

        this.createBasics()

        //this.addImage("src/assets/uanpi.jpg")
        this.removeImage()
    }

    update()
    {
        // Si tenemos varios objetos seleccionados trackeamos la posición del dummie para
        // aplicar a todos las mismas transformaciones
        if (this.selectedList.length >= 2)
        {
            const position = {x: this.selectionHelper.position.x - this.selectionHelperAux.position.x,
                              y: this.selectionHelper.position.y - this.selectionHelperAux.position.y,
                              z: this.selectionHelper.position.z - this.selectionHelperAux.position.z}

            const rotation = {x: this.selectionHelper.rotation.x - this.selectionHelperAux.rotation.x,
                              y: this.selectionHelper.rotation.y - this.selectionHelperAux.rotation.y,
                              z: this.selectionHelper.rotation.z - this.selectionHelperAux.rotation.z}

            const scale = {x: this.selectionHelper.scale.x - this.selectionHelperAux.scale.x,
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

        // Control de animaciones
        const c = this.clock.getDelta()
        for (let i = 0; i < this.mixer.length; i++)
        {
            this.mixer[i].update( c )
        }

        // Limita las escalas para que sean uniformes en todos los ejes
        for (let i = 0; i < this.liveObjects.children.length; i++){

            var objectScale = this.liveObjects.children[i].scale
            var scale

            //Se comprueba si ha cambiado la escala en x, y o z
            if (objectScale.x != objectScale.y && objectScale.x != objectScale.z){
                scale = objectScale.x
            }
            else if (objectScale.y != objectScale.x && objectScale.y != objectScale.z){
                scale = objectScale.y
            }
            else {
                scale = objectScale.z
            }

            // Se aplica la escala alterada al resto de ejes
            this.liveObjects.children[i].scale.x = scale
            this.liveObjects.children[i].scale.y = scale
            this.liveObjects.children[i].scale.z = scale
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

    addImage(url: string) {

        this.removeImage()

        var map = new THREE.TextureLoader().load( url );
        var material = new THREE.MeshBasicMaterial( { map: map, color: 0xffffff } );
        var geometry = new THREE.PlaneGeometry( 10, 10 );
        var plane = new THREE.Mesh(geometry, material)
        plane.rotateX(-90*Math.PI/180)
        plane.translateZ(-0.1)
        plane.translateX(-0.01)
        plane.translateY(-0.1)
        plane.name = "marcador"

        this.add( plane );
    }

    removeImage()
    {
        this.getObjectByName("marcador")?.removeFromParent()
    }

    addObject(obj: THREE.Object3D)
    {
        obj.name = "alive"
        obj.userData = {"animationIndex" : 0}
        this.liveObjects.add(obj)

        obj.userData["animationList"] = obj.animations
    }

    removeObject(obj: THREE.Object3D)
    {
        while (obj.name != "alive")
        {
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
            return this.selectionHelper
        }
    }

    selectObject(obj: THREE.Object3D)
    {
        while (obj.name != "alive")
        {
            obj = obj.parent!
        }

        // Se resetea el dummie para las selecciones múltiples
        this.selectionHelper.removeFromParent()
        this.selectionHelper = new THREE.Object3D
        this.selectionHelperAux.copy(this.selectionHelper)
        this.add(this.selectionHelper)

        if (!this.selectedList.includes(obj))
        {
            this.selectedList.push(obj)
            //const objMaterial : THREE.MeshPhongMaterial = (<THREE.MeshPhongMaterial>(<THREE.Mesh>obj.children[0]).material)
            //objMaterial.emissive.setHex(0x444444)
        }
    }

    unSelectAll()
    {
        const n = this.selectedList.length
        for (let i = 0; i < n; i++)
        {
            const obj = this.selectedList[i]
            //const objMaterial : THREE.MeshPhongMaterial = (<THREE.MeshPhongMaterial>(<THREE.Mesh>obj.children[0]).material)
            //objMaterial.emissive.setHex(0x000000)
            
        }

        this.selectedList = []
    }

    

    transformObject(obj: THREE.Object3D, mode: string, x: number, y: number, z: number)
    {
        if (mode == "translate")
        {
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

    loadScene(url: string)
    {
        const loader = new GLTFLoader()
        const scene = this

        loader.load( url, function ( gltf ) {

            gltf.scene.animations = gltf.animations

            while (gltf.scene.children[0].children.length > 0)
            {
                scene.loadAnimation(gltf.scene.children[0].children[0] , gltf.scene.animations)
                scene.addObject( gltf.scene.children[0].children[0] )
            }

        }, undefined, function ( error ) {

            console.error( error )

        } );
    }

    loadAnimation(obj: THREE.Object3D, animations: THREE.AnimationClip[])
    {
        for (var clipUser in obj.userData["animationList"])
        {
            for (var clipAnimation in animations)
            {
                if (obj.userData["animationList"][clipUser].name == animations[clipAnimation].name)
                {
                    obj.animations.push(animations[clipAnimation].clone())
                }
            }
        }
    }

    loadModel(url: string)
    {
        const loader = new GLTFLoader()
        const scene = this

        loader.load( url, function ( gltf ) {

            gltf.scene.animations = gltf.animations
            scene.addObject( gltf.scene )

        }, undefined, function ( error ) {

            console.error( error )

        } );
    }

    playAnimations()
    {
        this.mixer = []

        for (let i = 0, j = 0; i < this.liveObjects.children.length; i++){

            if (this.liveObjects.children[i].animations.length > 0)
            {
                this.mixer.push(new THREE.AnimationMixer( this.liveObjects.children[i] ))
                var action = this.mixer[j].clipAction (this.liveObjects.children[i].animations[this.liveObjects.children[i].userData["animationIndex"]])
                j++
                action.play()
            }
        }
    }

    stopAnimation()
    {
        for (let i = 0, j = 0; i < this.liveObjects.children.length && j < this.mixer.length; i++)
        {
            if (this.liveObjects.children[i].animations.length > 0)
            {
                var action = this.mixer[j].clipAction (this.liveObjects.children[i].animations[0])
                j++
                action.reset()
                action.stop()
            }
        }
        this.mixer = []
    }

    changeAnimationSelectedObjects()
    {
        for (let i = 0; i < this.selectedList.length; i++)
        {
            const numAnimations = this.selectedList[i].animations.length
            if (numAnimations > 1)
            {
                this.selectedList[i].userData["animationIndex"] = (this.selectedList[i].userData["animationIndex"] + 1) % numAnimations
            }
        }
        this.stopAnimation()
        this.playAnimations()
    }

    getModelJson()
    {

        var models: any[] = []

        for (let i = 0; i < this.liveObjects.children.length; i++)
        {
            models.push(
                {
                    "model_url": "",
                    "scale": this.liveObjects.children[i].scale.x,
                    "position": [
                        this.liveObjects.children[i].position.x,
                        this.liveObjects.children[i].position.y,
                        this.liveObjects.children[i].position.z
                    ],
                    "animation": ""
                }
            )
        }

        return {models}
    }

    

    // Funciones extraidas y adaptades de:
        // https://github.com/mrdoob/three.js/blob/master/editor/js/Menubar.File.js#L513
        // https://threejs.org/docs/index.html?q=expor#examples/en/exporters/GLTFExporter

    exportScene()
    {
        const that = this
        const animations = this.getAnimations( this );

        this.exporter.parse( 
            
            this.liveObjects, 

            function ( result ) {
			    that.saveArrayBuffer( result, 'objeto.glb' );
            },

            function ( error ) { console.log( 'An error happened' ) }, 

            { binary: true, animations: animations } 
        );
    }

    private saveArrayBuffer( buffer: any, filename: any ) //buscar tipos
    {
		this.save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
	}

    private save( blob: any, filename: any ) {
        const link = document.createElement( 'a' );

		if ( link.href ) {

			URL.revokeObjectURL( link.href );

		}

		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.json';
		link.dispatchEvent( new MouseEvent( 'click' ) );

	}

    getAnimations( scene: THREE.Object3D ) {

		const animations: any = [];

		scene.traverse( function ( object ) {

			animations.push( ... object.animations );
            
		} );

		return animations;

	}

    getSelectedAnimations() 
    {
        const animations: any = []

        for (let i = 0; i < this.liveObjects.children.length; i++)
        {
            const obj = this.liveObjects.children[i]

            if (obj.animations.length > 0)
            {
                animations.push(obj.animations[obj.userData["animationIndex"]].name)
            }
        }

        return animations
    }

}

