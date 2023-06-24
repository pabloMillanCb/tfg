export default interface SceneInterface {
    id: string,
    name: string,
    scene_type: string,
    audio: string,
    loop: boolean,
    image_url: string,
    coordinates: [],
    model_url: string,
    animations : []
  }