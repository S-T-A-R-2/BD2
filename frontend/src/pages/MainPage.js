import React, {useState, useEffect, useInsertionEffect} from 'react'
import { Button,TextField } from '../components/Templates.js';
import { useAuth } from '../context/AuthContext';
import {useNavigate, useLocation} from 'react-router-dom'
import { getRecommendations, getRepository } from '../api/auth.js';

const RecoTag = ({ recommendations,user }) => {
    const navigate = useNavigate();
    const location = useLocation();

    if (!recommendations || recommendations.length == 0) {
      return (
        <div>
          <h1 className='text-white text-3xl'>Recomendaciones 🗂️</h1>
          <p>No hay recomendaciones</p>;
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
        <h1 className='text-white text-3xl'>Recomendaciones 🗂️</h1>
        <ul>
          {recommendations.map(({ repo, owner }, index) => (
            <li key={index}>
              <a  href="#"
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
        
      if (isAuthenticated && user) {
        setUsername(user.username);
        setPassword(user.password);
        fetchRecommendations(user.username);      
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
		<div>

			<ul class="list-style-none" data-filterable-for="dashboard-repos-filter-left" data-filterable-type="substring">
				<li class="private source no-description">
					<div class="width-full d-flex mt-2">
					<a data-hydro-click="{&quot;event_type&quot;:&quot;dashboard.click&quot;,&quot;payload&quot;:{&quot;event_context&quot;:&quot;REPOSITORIES&quot;,&quot;target&quot;:&quot;REPOSITORY&quot;,&quot;record_id&quot;:755713506,&quot;dashboard_context&quot;:&quot;user&quot;,&quot;dashboard_version&quot;:2,&quot;user_id&quot;:126714838,&quot;metadata&quot;:null,&quot;originating_url&quot;:&quot;https://github.com/dashboard/my_top_repositories?location=left&quot;}}" data-hydro-click-hmac="e1446803eaac4ef05363eb330e0ca42f74d4161c84c59a0aa96d59d870b139b5" data-hovercard-type="repository" data-hovercard-url="/GeraldlTzy/TEC_I_Semestre_2024/hovercard" class="mr-2 d-flex flex-items-center" href="/GeraldlTzy/TEC_I_Semestre_2024">          		
					</a>        <div class="wb-break-word">
					
					<a data-hydro-click="{&quot;event_type&quot;:&quot;dashboard.click&quot;,&quot;payload&quot;:{&quot;event_context&quot;:&quot;REPOSITORIES&quot;,&quot;target&quot;:&quot;REPOSITORY&quot;,&quot;record_id&quot;:755713506,&quot;dashboard_context&quot;:&quot;user&quot;,&quot;dashboard_version&quot;:2,&quot;user_id&quot;:126714838,&quot;metadata&quot;:null,&quot;originating_url&quot;:&quot;https://github.com/dashboard/my_top_repositories?location=left&quot;}}" data-hydro-click-hmac="e1446803eaac4ef05363eb330e0ca42f74d4161c84c59a0aa96d59d870b139b5" data-hovercard-type="repository" data-hovercard-url="/GeraldlTzy/TEC_I_Semestre_2024/hovercard" class="color-fg-default lh-0 mb-2 markdown-title" href="/GeraldlTzy/TEC_I_Semestre_2024">
						GeraldlTzy<span class="color-fg-muted">/</span>TEC_I_Semestre_2024
					</a>        
					</div>
					</div>
				</li>
			</ul>
        
		  </div>

      <RecoTag recommendations={recommendations} user={user}/>

	  </div>)
  }

  </div>

);
}
export default MainPage
