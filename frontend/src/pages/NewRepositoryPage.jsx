import React, {useState, useEffect} from 'react'
import {useForm} from 'react-hook-form';
import { useLocation, useNavigate }  from 'react-router-dom';
import { createRepository, createRepoNeo, createBranches, getRepository, createCommits, createTagsNeo} from '../api/auth';
import {TagsInput}  from 'react-tag-input-component';
import '../reactTags.css';
import { useAuth } from '../context/AuthContext';

function NewRepositoryPage() {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [nameR, setName] = useState("name");
    const [descriptionR, setDescription] = useState("description");
    const [privateR, setPrivate] = useState(false);
    const [tagsR, setTags] = useState([]);
    const { user } = useAuth();    

    const createRepositoryAux = async () => {
        const rep = {
            owner: user.username,
            name: nameR,
            description: descriptionR,
            branches: [{
                name: "master",
                files: []
            }],
            tags: tagsR,
            commits: [],
            isPrivate: privateR
        };
        
        try { 
            await createRepository(rep);
            await createRepoNeo(rep);

            await createTagsNeo({tags:tagsR, owner: user.username, repo: nameR}); 

            const response = (await getRepository({ owner: user.username, name: nameR })).data[0];
            const Branch = {
                _id: response._id.toString(),
                branches: [
                  {
                    name: "master",
                    files: []
                  }
                ]
            };

            const initialCommitId = response.owner + "/" + response.name + "/" + Branch.branches[0].name;
            const initialCommit = {
                _id : initialCommitId,
                files : []
            }
            console.log(response._id);
            await createBranches(Branch, response._id);
            console.log((await createCommits(initialCommit, response._id)).data);
        } catch (error) {
            console.error('Error:', error);
        }
        navigate(-1);
    }

    return (
        
        <div className = "bg-zinc-800 max-w-md p-5 rounded-md flex justify-center flex-col m-auto h-screen">
    
                <div class="absolute top-0 right-0 ide-sm hide-md mb-1 d-flex flex-justify-between flex-items-center">
                    <a href="/" class="group block w-30 h-25 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">					
                        <h3 class="flex space-x-3text-slate-900 group-hover:text-white text-sm font-semibold">🏠 Volver a Página Principal</h3>	
                    </a>
                </div>
              
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
                    
                    <div className="bg-zinc-700 rounded-md px-4">
                        <pre className="text-white px4">Agregue las tags: </pre>
                        <TagsInput value={tagsR} onChange={setTags} name="tags" placeholder="tags" classNames={'tag-cls'}></TagsInput>
                    </div>
                    <input type="checkbox" onChange={e => setPrivate(e.target.checked)}/> <p className='text-white inline'>Hacer Privado</p>
    
                    <br />
    
                    <button type="submit" className = "bg-white text-black px-4 py-2 rounded-md my-2">Crear Repositorio</button>
                </form>
            </div>
        )
    }
    
    export default NewRepositoryPage
