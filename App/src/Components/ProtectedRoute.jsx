import { Navigate, Outlet } from 'react-router-dom'
import { AppContext } from '../App';
import { useContext } from 'react';
import Login from './Login';

const Protected = ()=>{
    const { isAuth } = useContext(AppContext)
    return (
        <>
            {
                isAuth
                ? <Outlet />
                : <Login />
            }
        </>
    )
}

export default Protected;