import {useForm} from 'react-hook-form'
import { registerRequest } from '../api/auth';
function RegisterPage() {
    const { register, handleSubmit } = useForm();
    return (
        <div className = "w-full bg-zinc-800 max-w-md p-10 rounded-md">
            <form onSubmit={handleSubmit(async (values) => {
                await registerRequest(values);
            })}>
                <input type="text" {...register("username", {required: true})}
                className = "w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='Username'/>
                <input type="email" {...register("email", {required: true})}
                className = "w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='Email'/>
                <input type="password" {...register("password", {required: true})}
                className = "w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='Password'/>
                <button tyoe="submit" className = "px-4 py-2 rounded-md text-white my-2">Registrarse</button>
            </form>
        </div>
    )
}

export default RegisterPage