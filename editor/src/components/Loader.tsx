import { ClipLoader } from 'react-spinners'
import "../styles/Loader.css"

interface LoaderInterface {
    loading: boolean
}

function Loader({loading}: LoaderInterface) {

    return (
        <div className='loader'>
            <ClipLoader
                loading={loading}
                size={150}
                color='#ffc400'
            />
        </div>
    )
}

export default Loader