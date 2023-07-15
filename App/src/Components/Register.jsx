import { motion } from "framer-motion"
import { useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";


const Register = function () {
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
        console.log(data);
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('passwordConfirmation', data.passwordConfirmation);
        formData.append('image', file.current.files[0]);
        fetch(`${import.meta.env.VITE_API}/auth/register`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
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
                <h1 className="text-2xl font-bold text-center text-tertiary">Register</h1>
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
                    <label htmlFor="email" className="text-quaternary">email</label>
                    <input 
                        { ...register('email', { reauired: true }) } 
                        type="email"
                        placeholder="email"
                        className="bg-tertiary outline-none px-5 py-3 rounded-md shadow-lg text-primary placeholder:text-secondary" 
                    />
                    {
                        errors.email 
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
                <div className="flex flex-col gap-2 ">
                    <label htmlFor="confirm_pwd" className="text-quaternary">Confirm Password</label>
                    <input 
                        type="password"
                        { ...register('passwordConfirmation', { reauired: true }) } 
                        placeholder="Confirm Password"
                        className="bg-tertiary outline-none px-5 py-3 rounded-md shadow-lg text-primary placeholder:text-secondary" 
                    />
                    {
                        errors.confirm_pwd 
                        && <span className="text-sm text-red-800">This field is required.</span>
                    }
                </div>
                <div className="flex flex-col gap-2 justify-center items-center">
                    <input 
                        type="file" 
                        ref={file}
                        onChange={handleFileImport}
                        className="hidden" />
                    <img 
                        src="" 
                        alt="Import image" 
                        ref={image}
                        onClick={() => file.current.click()}
                        className="w-full max-h-32 h-auto p-2 object-cover rounded-md cursor-pointer transition-all border-dashed border-2 border-quaternary hover:border-solid hover:border-tertiary " />
                </div>
                <button 
                    type="submit"
                    className="px-5 py-3 rounded-md cursor-pointer bg-primary text-tertiary">
                    Register
                </button>
                <Link to='/login' className="text-center text-blue-500"> Login </Link>
            </form>
        </motion.div>
    )
}

export default Register;