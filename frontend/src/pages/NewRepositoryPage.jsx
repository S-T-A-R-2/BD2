import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import { createRepository } from '../api/auth';

function NewRepositoryPage() {
    const { register, handleSubmit } = useForm();
    const [nameR, setName] = useState("name");
    const [descriptionR, setDescription] = useState("description");
    const [privateR, setPrivate] = useState(false);
    const [tagsR, setTags] = useState("");
    const tagsRT = tagsR.split(" ");
    
    const createRepositoryAux = async () => {
        const rep = {
            owner: "Gerald",
            name: nameR,
            description: descriptionR,
            branches: [{
                name: "master",
                files: []
            }],
            tags: tagsRT,
            commits: [],
            isPrivate: privateR
        };
        await createRepository(rep);
    }
    
    
    return (
        
    <div className = "bg-zinc-800 max-w-md p-5 rounded-md flex justify-center flex-col m-auto h-screen">
          
            <h1 className="text-white my-2 w-full font-bold text-5xl">Crear Repositorio</h1>

            <form onSubmit={handleSubmit((values) => {
                createRepositoryAux();
            })}>
                <input type="text" onChange={e => setName(e.target.value)}
                className = "w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='Nombre del Repositorio'/>

                <input type="text" onChange={e => setDescription(e.target.value)}
                className = "w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='Descripción'/>

                <input type="text" onChange={e => setTags(e.target.value)}
                className = "w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='Tags - separelas por espacios'/>

                <input type="checkbox" onChange={e => setPrivate(e.target.checked)}/> <p className='text-white inline'>Hacer Privado</p>

                <br />

                <button type="submit" className = "bg-white text-black px-4 py-2 rounded-md my-2">Crear Repositorio</button>
            </form>
        </div>
    )
}

export default NewRepositoryPage
