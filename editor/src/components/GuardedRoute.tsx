import { Navigate, Outlet } from 'react-router-dom';
import {useState} from 'react'
import { getAuth } from "firebase/auth";
import firebase from '../config/firebase-config';
import { useAuth } from '../controller/userController';


const GuardedRoute = () => {
    const { currentUser } = useAuth()

    return(
        currentUser ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default GuardedRoute;