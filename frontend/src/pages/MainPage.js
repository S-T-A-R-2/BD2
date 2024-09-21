import React, {useState, useEffect, useInsertionEffect} from 'react'
import { Button,TextField } from '../components/Templates.js';
import { useAuth } from '../context/AuthContext';
import {useNavigate, useLocation} from 'react-router-dom'
import { getRecommendations, getRepository, getOwnedRepos } from '../api/auth.js';

const RecoTag = ({ recommendations,user }) => {
    const navigate = useNavigate();
    const location = useLocation();

    if (!recommendations || recommendations.length == 0) {
      return (
        <div>
          <p>No hay repositorios</p>
        </div>
      );
    }
    
    const handleRepositoryClick = async (ownerP, nameP) => {
      try {
        const repo = await getRepository({owner:ownerP, name:nameP});
        const repository = JSON.stringify(repo.data[0]);
      

        localStorage.setItem('repository', repository);
        navigate(`/repository/${repository._id}`, {
          state: { repository: repository, user: user}
        })
        
      } catch (error) {
        console.error('Error fetching repository:', error);
      }
    };

    return (
      <div>
        
        <ul>
          {recommendations.map(({ repo, owner }, index) => (
            <li key={index}>
              <a  href="#" className="flex-justify-between text-black rounded-lg p-1 bg-white shadow-lg hover:bg-sky-500 group-hover:text-white text-sm font-semibold inline text-center"
                onClick={(e) => {
                  handleRepositoryClick(owner.properties.username, repo.properties.name);
                }}
              >
                {`${owner.properties.username}/${repo.properties.name}`}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
};

export const MainPage = () => {
	//const [username, setUsername] = useState("Página principal");
	const [username, setUsername] = useState(null);
	const [password, setPassword] = useState(null);
  const [recommendations,setRecos] = useState([]);
  const [ownedRepos, setOwned] = useState([]);
	const { isAuthenticated, logout, user } = useAuth();
	const navigate = useNavigate();
    useEffect(() => {
      const fetchRecommendations = async (userName) => {
        try {
          const recos = await getRecommendations({ username: userName });
          setRecos(recos.data.recommendations); 
          
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      };

      const fetchOwned = async (userName) => {
        try {
          const recos = await getOwnedRepos({ username: userName });
          setOwned(recos.data.ownedR); 
          
        } catch (error) {
          console.error('Error fetching owned:', error);
        }
      };
        
      if (isAuthenticated && user) {
        setUsername(user.username);
        setPassword(user.password);
        fetchRecommendations(user.username);      
        fetchOwned(user.username);
        console.log(ownedRepos);
      }
    }, [isAuthenticated, user]);

	const handleLogout = () => {
		logout();
		window.location.reload();
	}

return (
	<div className='text-white bg-zinc-800 flex  flex-col m-auto h-screen'>
		<h1 className="text-4xl">Página principal 🏠</h1>

		<h1 className= "text-3xl">Usuario: {username}</h1>
 
			  
		<div onClick={e => navigate("/searchRepository",{state:{user:user}})} class="absolute top-0 right-0 ide-sm hide-md mb-1 d-flex flex-justify-between flex-items-center">
			<button class="group block w-60 h-35 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">					
				<h3 className="flex space-x-3text-slate-900 group-hover:text-white text-sm font-semibold inline">🔎 Buscar Repositorio</h3>
			</button>		
			{!isAuthenticated && (
			<a href="/login" class="group block w-30 h-25 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">					
				<h3 className="flex space-x-3text-slate-900 group-hover:text-white text-sm font-semibold inline text-center">🚪 Login</h3>	
			</a> )}
			<a href="/login" class="group block w-30 h-25 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">					
				<h3 className="flex space-x-3text-slate-900 group-hover:text-white text-sm font-semibold inline text-center">🚪 Ver perfil</h3>	
			</a>MainPage
	
		</div>
		
  { username &&
	
  (<div>
	<button onClick={handleLogout}  class="group block w-50 h-25 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">					
			<h3 className="flex space-x-3text-slate-900 group-hover:text-white text-sm font-semibold inline text-center">🚪 Logout</h3>	
		</button>



  <h1 className="text-3xl">Mis repositorios</h1>
	


  <div class="hide-sm hide-md mb-1 d-flex flex-justify-between flex-items-center">
			<a href="/newRepository" class="group block absolute w-30 h-25 left-0 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">					
				<h3 className="flex space-x-3text-slate-900 group-hover:text-white text-sm font-semibold">📂 Nuevo Repositorio</h3>	
			</a>
		</div>

		<br/>
		<br/>
    <RecoTag recommendations={ownedRepos} user = {user}/>
		
    <h1 className='text-white text-3xl'>Recomendaciones 🗂️</h1>
    <RecoTag recommendations={recommendations} user={user}/>

	  </div>)
  }

  </div>

);
}
export default MainPage
