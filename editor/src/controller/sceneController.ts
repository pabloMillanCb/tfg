import axios from "axios"
import { useAuth } from "./userController"
import SceneInterface from "../interfaces/SceneInterface"


export async function getScenesFromUser(uid: string): Promise<SceneInterface[]>
{
    const { currentUser } = await useAuth()
    const token = await currentUser?.getIdToken()
    const res = await axios.get('http://localhost:5000/get/escenas/'+currentUser?.uid, {
        headers: {
          Authorization: 'Bearer ' + token,
  
        },
      })
    return res.data
}

export async function postScene(uid: string, files: Blob | File[])
{

}

export async function updateScene(uid: string, files: Blob | File[])
{

}

export async function deleteScene(uid: string)
{

}