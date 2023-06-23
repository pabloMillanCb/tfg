export default interface SceneInterface {
    id: string,
    name: string,
    scene_type: string,
    sound: string,
    loop: boolean,
    image_url: string,
    coordinates: [],
    model_url: string,
    animations : []
  }