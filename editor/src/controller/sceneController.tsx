import React, { useContext, useState, useEffect, createContext } from "react"
import { firebaseAuth } from "../config/firebase-config"
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { useAuth } from "./userController"
import axios from "axios"
import SceneInterface from "../interfaces/SceneInterface"
import { deleteObject, getStorage, ref, uploadBytes } from "firebase/storage"
import Loader from "../components/Loader"

interface SceneContextInterface {
    getScenesFromUser(): Promise<SceneInterface[]>,
    uploadScene(id: string, json: string, model: Blob | File, img: File | undefined, sound: File | undefined)
    :Promise<string>,
    postScene(json: string, model: Blob | File, img: File | undefined, sound: File | undefined)
    :Promise<string>,
    updateScene(id: string, json: string, model: Blob | File, img: File | undefined, sound: File | undefined)
    :Promise<string>,
    deleteScene(id: string): any,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

interface SceneContextChildren {
    children: JSX.Element
}

// @ts-ignore
const SceneContext = createContext<SceneContextInterface>()


export function useScn() {
  return useContext(SceneContext)
}

export function SceneProvider( props: SceneContextChildren ) {
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()

  async function getScenesFromUser(): Promise<SceneInterface[]> {
    
    const token = await currentUser?.getIdToken()
    const res = await axios.get('http://localhost:5000/get/escenas/'+currentUser?.uid, {
        headers: {
          Authorization: 'Bearer ' + token,
  
        },
      })
    //console.log(res.data)
    return res.data
  }

  async function uploadScene(id='', json: string, model: Blob, img: File | undefined, sound: File | undefined)
  :Promise<string> {

    setLoading(true)

    if (id=='') { return postScene(json, model, img, sound) }

    else { return updateScene(id, json, model, img, sound) }

  }

  async function postScene(json: string, model: Blob | File, img: File | undefined, sound: File | undefined)
  :Promise<string> {
    const token = await currentUser?.getIdToken()
    const res = await axios.post('http://localhost:5000/post/escenas', JSON.parse(json), {
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
    const id = res.data.idscene

    const storage = getStorage();
    const petitions: Promise<any>[] = []
    
    const storageRef = ref(storage, 'models/' + id + '.glb');
    petitions.push(
      uploadBytes(storageRef, model).then((snapshot) => {
        console.log('Uploaded a model file!');
      }),
    )

    if (sound != undefined)
    {
      const soundRef = ref(storage, 'audio/' + id + '.mp3');
      petitions.push(
        uploadBytes(soundRef, sound).then((snapshot) => {
          console.log('Uploaded a sound file!');
        })
      )
    }

    if (img != undefined)
    {
      const imagenRef = ref(storage, 'images/' + id + '.jpg');
      petitions.push(
        uploadBytes(imagenRef, img).then((snapshot) => {
          console.log('Uploaded a image file!');
        })
      )
    }

    Promise.all(petitions).then(() => setLoading(false))

    return id
  }

  async function updateScene(id: string, json: string, model: Blob, img: File | undefined, sound: File | undefined)
  :Promise<string> {

    const token = await currentUser?.getIdToken()
    const res = await axios.put('http://localhost:5000/update/escenas/'+id, JSON.parse(json), {
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })

    const petitions: Promise<any>[] = []
    const storage = getStorage();

    const storageRef = ref(storage, 'models/' + id + '.glb');
    petitions.push(
      uploadBytes(storageRef, model).then((snapshot) => {
        console.log('Uploaded a model file!');
      }),
    )

    if (sound != undefined)
    {
      const soundRef = ref(storage, 'audio/' + id + '.mp3');
      petitions.push(
        uploadBytes(soundRef, sound).then((snapshot) => {
          console.log('Uploaded a sound file!');
        })
      )
    }

    if (img != undefined)
    {
      const imagenRef = ref(storage, 'images/' + id + '.jpg');
      petitions.push(
        uploadBytes(imagenRef, img).then((snapshot) => {
          console.log('Uploaded a image file!');
        })
      )
    }

    Promise.all(petitions).then(() => setLoading(false))

    return id
  }

  async function deleteScene(id: string) {
    const token = await currentUser?.getIdToken()
    const res = await axios.delete('http://localhost:5000/delete/escenas/'+id, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
    
      // borrar los archivos asociados
      const storage = getStorage()
      const modelRef = ref(storage, 'models/' + id + '.glb')
      const soundRef = ref(storage, 'audio/' + id + '.mp3')
      const imagenRef = ref(storage, 'images/' + id + '.jpg')

      await Promise.all([
        deleteObject(soundRef),
        deleteObject(modelRef),
        deleteObject(imagenRef)
      ])
  }

  const value: SceneContextInterface = {
    loading,
    setLoading,
    getScenesFromUser,
    uploadScene,
    postScene,
    updateScene,
    deleteScene,
  }
  

  return (
    <SceneContext.Provider value={value}>
      <Loader loading={loading}/>
      {props.children}
    </SceneContext.Provider>
  )
}