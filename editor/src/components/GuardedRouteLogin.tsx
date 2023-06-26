import { Navigate, Outlet } from 'react-router-dom';
import {useState} from 'react'
import { getAuth } from "firebase/auth";
import firebase from '../config/firebase-config';
import { useAuth } from '../controller/userController';


const GuardedRouteLogin = () => {
    const { currentUser } = useAuth()

    return(
        (!currentUser) ? <Outlet/> : <Navigate to="/"/>
    )
}

export default GuardedRouteLogin;