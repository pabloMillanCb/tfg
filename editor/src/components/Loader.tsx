import {ClipLoader, MoonLoader} from 'react-spinners'
import "../styles/Loader.css"
import { exp } from 'three/examples/jsm/nodes/Nodes.js'

interface LoaderInterface {
    loading: boolean
}

function Loader({loading}: LoaderInterface) {

    return (
        <div className='loader'>
            <ClipLoader
                loading={loading}
                size={150}
                color='#673ab7'
            />
        </div>
    )
}

export default Loader