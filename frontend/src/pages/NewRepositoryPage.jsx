import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import { createRepository } from '../api/auth';

function NewRepositoryPage() {
    const { register, handleSubmit } = useForm();
    const [nameR, setName] = useState("name");
    const [descriptionR, setDescription] = useState("description");
    const [privateR, setPrivate] = useState(false);
    
    const createRepositoryAux = async () => {
        const rep = {
            owner: "Gerald",
            name: nameR,
            description: descriptionR,
            branches: [{
                name: "master",
                files: []
            }],
            commits: [],
            isPrivate: privateR
        };
        await createRepository(rep);
    }
    
    
    return (
        
    <div className = "max-w-sm bg-zinc-800 max-w-md p-10 rounded-md flex justify-center flex-col m-auto h-screen">
          
            <h1 className="text-white my-2 w-full">Crear repositorio</h1>

            <form onSubmit={handleSubmit((values) => {
                createRepositoryAux();
            })}>
                <input type="text" onChange={e => setName(e.target.value)}
                className = "w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='name'/>

                <input type="text" onChange={e => setDescription(e.target.value)}
                className = "w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='description'/>

                <input type="checkbox" onChange={e => setPrivate(e.target.checked)}/> <p className='text-white inline'>Make Private</p>

                <br />

                <button type="submit" className = "bg-white text-black px-4 py-2 rounded-md my-2">Crear Repositorio</button>
            </form>
        </div>
    )
}

export default NewRepositoryPage
