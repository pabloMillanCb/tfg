import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../controller/userController';


const GuardedRoute = () => {
    const { currentUser } = useAuth()

    return(
        currentUser ? <Outlet/> : <Navigate to="/signin"/>
    )
}

export default GuardedRoute;