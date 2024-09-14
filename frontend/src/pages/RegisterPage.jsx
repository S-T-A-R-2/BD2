import React from 'react'
import {useForm} from 'react-hook-form'
import {useAuth} from '../context/AuthContext'
import { useEffect } from 'react';
import {useNavigate, Link} from 'react-router-dom'

function RegisterPage() {
    const { register, handleSubmit, formState: {
        errors,
    } } = useForm();
    const { signUp, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (isAuthenticated) navigate("/");
    // }, [isAuthenticated]);

    const onSubmit = handleSubmit( async (values) => {
        signUp(values);

    });
    
    return (
        
    <div className = "max-w-sm bg-zinc-800 max-w-md p-2 rounded-md flex justify-center flex-col m-auto h-screen">
          <div className="bg-zinc-900 max-w-md w-full p-10 rounded-md">
                {registerErrors.map((error, i) => (
                    <div className="bg-red-500 p-2 text-white" key={i}>
                        {error}
                    </div>
                ))}
                <h1 className="text-white my-2 w-full">Registrar Cuenta</h1>

                <form onSubmit={onSubmit}>
                    <input type="text" {...register("username", {required: true})}
                    className = "w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                    placeholder='Username'/>
                    {errors.username && (
                        <p className="text-red-500">Username is required</p>
                    )}
                    <input type="text" {...register("name", {required: true})}
                    className = "w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                    placeholder='Name'/>  
                    {errors.name && (
                        <p className="text-red-500">Name is required</p>
                    )}    
                    <input type="email" {...register("email", {required: true})}
                    className = "w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                    placeholder='Email'/>
                    {errors.email && (
                        <p className="text-red-500">Email is required</p>
                    )}
                    <input type="password" {...register("password", {required: true})}
                    className = "w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                    placeholder='Password'/> 
                    {errors.password && (
                        <p className="text-red-500">Password is required</p>
                    )}

                    <button type="submit" className = "bg-white text-black px-4 py-2 rounded-md my-2">Registrarse</button>
            </form>

                <p className="flex gap-x-2 justify-between text-white">
                    Iniciar Sesión <Link to="/login" className="text-sky-500">Login</Link>
                </p>

            </div>
        </div>
    )
}

export default RegisterPage
