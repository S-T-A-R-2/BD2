import React, {useState, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import { getRepository, getRepositories } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function SearchRepositoryPage() {
  // Variables
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [params, setParams] = useState("");
  const [loading, setLoading] = useState(false);
  const [repositories, setRepositories] = useState([]);

  /* Conexión con la base de datos para obtener los repositorios*/
  const findRepositoriesAux = async () => {
    setLoading(true);
    const [param1, param2] = params.split('/'); // Parametros para buscar el repositorio
    const crit = {
      owner : param1,
      name : param2
    };
    if (!param2){
      console.log(param1)
      setRepositories((await getRepositories({name : param1})).data)
    } else {
      setRepositories((await getRepository({owner : param1, name: param2})).data);
    }
    setLoading(false);
  }

  const viewRepository = (repository) => {
    localStorage.setItem('repository', JSON.stringify(repository));
    navigate(`/repository/${repository._id}`, {
      state: { repository: repository, user: user }
      })
  }
  
  const RepositoriesList = () => {
    if (repositories) {
      return (
        <div class="scroll-pb-6">
        <ul role="list" class="p-6 divide-y divide-slate-200 bg-white max-w-md">
          {repositories.map((repository, index) => (
            <li key={repository._id} class="group/item flex py-4 first:pt-0 last:pb-0">
              <div className="w-full cursor-pointer" onClick={e => viewRepository(repository)}>
                <p class="text-sm font-medium text-slate-900">{repository.owner}/{repository.name}</p>
                <p class="text-sm text-slate-500 truncate">{repository.description}</p>
              </div>
            </li>
          ))}
        </ul>
        </div>
      )
    }
  }
  
  if (loading) {
    return <p>Loading...</p>;
  }

  return ( 
    <div className = "bg-zinc-800 p-10 rounded-md flex justify-center flex-col m-auto h-screen">
      
      <div class="absolute top-0 right-0 ide-sm hide-md mb-1 d-flex flex-justify-between flex-items-center">
				<a href="/" class="group block w-30 h-25 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">					
					<h3 class="flex space-x-3text-slate-900 group-hover:text-white text-sm font-semibold">🏠 Volver a Página Principal</h3>	
				</a>
			</div>


      <h1 className="text-white my-2 w-full font-bold text-6xl">Search Repositories</h1>

      <label class="inset text-black text-5xl">		
				<input class="w-full placeholder:italic placeholder:text-black placeholder:text-slate-400 block bg-white text-black border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm inline" 
          placeholder="Search for a repository..." type="text" name="search" onChange={e => setParams(e.target.value)}/>
        <button class="bg-sky-500 hover:bg-sky-700 text-2xl inline px-4 py-2 rounded-md my-2" onClick={findRepositoriesAux}> Search </button>
			</label>
      
      <RepositoriesList/>
    </div>
    )
}
export default SearchRepositoryPage
