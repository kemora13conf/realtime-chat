import { motion } from "framer-motion"
import { useContext, useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import { AppContext } from "../App";

const Login = function () {

    const { isAuth, setIsAuth } = useContext(AppContext)
    const { register, handleSubmit} = useForm();
    const [ errors, setErrors ] = useState({});
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
            document.cookie = `jwt=${encodeURIComponent(data.data)};expires=expirationDate;path=/`;
            setIsAuth(true);
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <motion.div className="w-full min-h-screen flex flex-col justify-center items-center bg-primary">
            <form 
                onSubmit={ handleSubmit(onSubmit) }
                className="flex flex-col gap-2 max-w-md w-full h-fit p-4 bg-secondary rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-tertiary">Login</h1>
                <div className="flex flex-col gap-2 ">
                    <label htmlFor="username" className="text-quaternary">Username</label>
                    <input 
                        { ...register('username', { reauired: true }) } 
                        placeholder="Username"
                        className="bg-tertiary outline-none px-5 py-3 rounded-md shadow-lg text-primary placeholder:text-secondary" 
                    />
                    {
                        errors.username 
                        && <span className="text-sm text-red-800">This field is required.</span>
                    }
                </div>
                <div className="flex flex-col gap-2 ">
                    <label htmlFor="password" className="text-quaternary">password</label>
                    <input 
                        type="password"
                        { ...register('password', { reauired: true }) } 
                        placeholder="password"
                        className="bg-tertiary outline-none px-5 py-3 rounded-md shadow-lg text-primary placeholder:text-secondary" 
                    />
                    {
                        errors.password 
                        && <span className="text-sm text-red-800">This field is required.</span>
                    }
                </div>
                <button 
                    type="submit"
                    className="px-5 py-3 rounded-md cursor-pointer bg-primary text-tertiary">
                    Login
                </button>
                <Link to='/register' className="text-center text-blue-500"> Register </Link>
                
            </form>
        </motion.div>
    )
}

export default Login;