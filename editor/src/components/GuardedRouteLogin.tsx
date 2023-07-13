import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../controller/userController';


const GuardedRouteLogin = () => {
    const { currentUser } = useAuth()

    return(
        (!currentUser) ? <Outlet/> : <Navigate to="/"/>
    )
}

export default GuardedRouteLogin;