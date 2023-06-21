import { Navigate, Outlet } from 'react-router-dom';
import {useState} from 'react'
import { getAuth } from "firebase/auth";


const GuardedRoute = () => {
    const [auth, setAuth] = useState(
		false || window.localStorage.getItem('auth') === 'true'
	);

    return(
        auth ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default GuardedRoute;