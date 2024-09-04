import {useForm} from 'react-hook-form'
import { registerRequest } from '../api/auth';
function RegisterPage() {
    const { register, handleSubmit } = useForm();
    return (
        <div>
            <form onSubmit={handleSubmit(async (values) => {
                await registerRequest(values);
            })}>
                <input type="text" {...register("username", {required: true})}/>
                <input type="email" {...register("email", {required: true})}/>
                <input type="password" {...register("password", {required: true})}/>
                <button tyoe="submit">Registrarse</button>
            </form>
        </div>
    )
}

export default RegisterPage