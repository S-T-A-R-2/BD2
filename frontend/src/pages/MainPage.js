import React, {useState} from 'react'
import { Button,TextField } from '../components/pruebas.js';

export const MainPage = () => {
	const [username, setUsername] = useState("Página principal");
	const [password, setPassword] = useState("");
	const ValidateUser = (user, pass) => {
		//llamar a la base de datos
		var a = 9
        alert("Se perdió");
	}
	//Imprimir error
	return (
		<div className='text-white bg-zinc-800 flex  flex-col m-auto h-screen'>
			<h1>Página principal</h1>
			<h1>Mis repositorios</h1>

            <h1>Perfil</h1>
			<br />
			<TextField oldText = {password} onChange = {setPassword}/> <p>Pass: {password}</p>
			<br />			
			<label class="absolute inset top-0 right-0 text-black">
				<span class="sr-only">Search</span>
				<span class="absolute inset-y-0 left-0 flex items-center pl-2">
					<svg class="h-5 w-5 fill-slate-300" viewBox="0 0 20 20"></svg>
				</span>
				<input class="placeholder:italic placeholder:text-slate-400 block bg-white text-black w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Search for a repository..." type="text" name="search"/>
			</label>
			
			<div class="hide-sm hide-md mb-1 d-flex flex-justify-between flex-items-center">
				<a href="/repositories" class="group block absolute w-30 h-25 left-0 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">					
					<h3 class="flex space-x-3text-slate-900 group-hover:text-white text-sm font-semibold">📂New Repository</h3>	
				</a>
			</div>
			<br/>
			<br/>
			<div>

				<h1 className='text-white'>Repositories</h1>
				<ul class="list-style-none" data-filterable-for="dashboard-repos-filter-left" data-filterable-type="substring">
					<li class="private source no-description">
						<div class="width-full d-flex mt-2">
						<a data-hydro-click="{&quot;event_type&quot;:&quot;dashboard.click&quot;,&quot;payload&quot;:{&quot;event_context&quot;:&quot;REPOSITORIES&quot;,&quot;target&quot;:&quot;REPOSITORY&quot;,&quot;record_id&quot;:755713506,&quot;dashboard_context&quot;:&quot;user&quot;,&quot;dashboard_version&quot;:2,&quot;user_id&quot;:126714838,&quot;metadata&quot;:null,&quot;originating_url&quot;:&quot;https://github.com/dashboard/my_top_repositories?location=left&quot;}}" data-hydro-click-hmac="e1446803eaac4ef05363eb330e0ca42f74d4161c84c59a0aa96d59d870b139b5" data-hovercard-type="repository" data-hovercard-url="/GeraldlTzy/TEC_I_Semestre_2024/hovercard" class="mr-2 d-flex flex-items-center" href="/GeraldlTzy/TEC_I_Semestre_2024">          		
						</a>        <div class="wb-break-word">
						<a data-hydro-click="{&quot;event_type&quot;:&quot;dashboard.click&quot;,&quot;payload&quot;:{&quot;event_context&quot;:&quot;REPOSITORIES&quot;,&quot;target&quot;:&quot;REPOSITORY&quot;,&quot;record_id&quot;:755713506,&quot;dashboard_context&quot;:&quot;user&quot;,&quot;dashboard_version&quot;:2,&quot;user_id&quot;:126714838,&quot;metadata&quot;:null,&quot;originating_url&quot;:&quot;https://github.com/dashboard/my_top_repositories?location=left&quot;}}" data-hydro-click-hmac="e1446803eaac4ef05363eb330e0ca42f74d4161c84c59a0aa96d59d870b139b5" data-hovercard-type="repository" data-hovercard-url="/GeraldlTzy/TEC_I_Semestre_2024/hovercard" class="color-fg-default lh-0 mb-2 markdown-title" href="/GeraldlTzy/TEC_I_Semestre_2024">
							GeraldlTzy<span class="color-fg-muted">/</span>TEC_I_Semestre_2024
						</a>        </div>
						</div>
					</li>
				</ul>
			</div>
      	


	  </div>

	);
}
export default MainPage