import { motion } from "framer-motion"
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import Loading from "./Loading";

const Login = function () {

    const { isAuth, setIsAuth, socket } = useContext(AppContext)
    const { register, handleSubmit} = useForm();
    const [ errors, setErrors ] = useState({});
    const [ loaded, setLoaded ] = useState(false)
    const navigate = useNavigate()
    const file = useRef(null);
    const image = useRef(null);
    
    const handleFileImport = function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            image.current.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }


    const onSubmit = function (data) {
        // event.preventDefault();

        fetch(`${import.meta.env.VITE_API}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            var expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 3);
            document.cookie = `jwt=${encodeURIComponent(data.data)};expires=${expirationDate};path=/`;
            setIsAuth(true);
        })
        .catch(error => {
            console.log(error);
        });
    }
    if(isAuth){
        console.log('isAuth: ',isAuth)
        navigate('/')
    }
    useEffect(()=>{
        setLoaded(true)
    })
    if(!loaded){
        return <Loading />
    }

    return (
        <motion.div className="relative w-full min-h-screen flex flex-col justify-center items-center bg-primary-500">
            <motion.form 
                initial={{opacity: 0, scale: 0.5}}
                animate={{opacity: 1, scale: 1}}
                transition={{
                    type: 'tween',
                    duration: 0.3
                }} 
                onSubmit={ handleSubmit(onSubmit) }
                className="absolute flex flex-col gap-3 max-w-md w-full h-fit p-4 px-8 bg-secondary-500 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-tertiary-500">Login</h1>
                <div className="flex flex-col gap-2 ">
                    <label htmlFor="username" className="text-quaternary-500">Username</label>
                    <input 
                        { ...register('username', { reauired: true }) } 
                        placeholder="Username"
                        className="bg-tertiary-500 outline-none px-5 py-3 rounded-md shadow-lg text-primary-500 placeholder:text-secondary-500" 
                    />
                    {
                        errors.username 
                        && <span className="text-sm text-red-800">This field is required.</span>
                    }
                </div>
                <div className="flex flex-col gap-2 ">
                    <label htmlFor="password" className="text-quaternary-500">password</label>
                    <input 
                        type="password"
                        { ...register('password', { reauired: true }) } 
                        placeholder="password"
                        className="bg-tertiary-500 outline-none px-5 py-3 rounded-md shadow-lg text-primary-500 placeholder:text-secondary-500" 
                    />
                    {
                        errors.password 
                        && <span className="text-sm text-red-800">This field is required.</span>
                    }
                </div>
                <button 
                    type="submit"
                    className="px-5 py-3 mt-4 rounded-md cursor-pointer bg-primary-500 text-tertiary-500">
                    Login
                </button>
                <Link to='/register' className="text-center text-blue-500"> Register </Link>
                
            </motion.form>
        </motion.div>
    )
}

export default Login;