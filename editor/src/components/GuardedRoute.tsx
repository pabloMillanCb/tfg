import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../controller/userController';


const GuardedRoute = () => {
    const { currentUser } = useAuth()

    return(
        currentUser ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default GuardedRoute;