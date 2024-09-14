import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate }  from 'react-router-dom';
import { createFile, getFiles } from '../api/auth.js';


export const RepositoryPage = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState(null);
	const [file, setFile] = useState({name : "", content : ""});
	const [files, setFiles] = useState([]);
	const [password, setPassword] = useState("");
	const location = useLocation();
	const [repository, setRepository] = useState(location.state ? location.state.repository : null);
	const [loadFiles, setLoadFiles] = useState (true);
	
	
	// Para mostrar el menú desplegable
	const [isOpen, setIsOpen] = useState(false);
	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	
	useEffect(() => {
		
		//const loggedIn = localStorage.getItem('loggedIn');
		//if (loggedIn === 'true') {
		
			// Recuperar el nombre de usuario del login	
			const storedUsername = localStorage.getItem('user');
			if (storedUsername) {
				setUsername(JSON.parse(storedUsername));
				console.log('Username:', JSON.parse(storedUsername));
				localStorage.removeItem('loggedIn');
			}
		//}
	}, []);

	const updateFiles = async () => {
		setFiles((await getFiles({repositoryId : repository._id})).data);
		setLoadFiles(false);
	}
	if (loadFiles)
		updateFiles();

	const [contents, setContents] = useState(null);
	const [filename, setFilename] = useState(null);
	const reader = new FileReader();

	// Actualizar el contenido del archivo
	reader.onload = async () => {
		setContents(reader.result);
	}

	// Actualizar el archivo cuando el contenido es actualizado
	useEffect(() => {
		if (contents){
			setFile({name : filename, content: contents})
		}
	}, [contents]);

	// Descargar archivos
	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
	  
		element.style.display = 'none';
		document.body.appendChild(element);
	  
		element.click();
	  
		document.body.removeChild(element);
	}


	// Leer archivos cargador por el usuario
	const filess = (value) => {
		console.log(typeof value);
		setFilename(value[0].name)
		reader.readAsText(value[0]);
		//setContents(reader.result);
		
	}
	// Guardar archivos en la base de datos
	const saveFile = () => {
		// Llamar a la base de datos
		//SaveFile(filename, contents)
		console.log(file);
	}

	// Añadir archivo a la lista de archivos
	const addFile = async () => {
		setFiles([...files, file]);
		const newFile = {
			_id : file.name,
			content : file.content
		};
		await createFile(newFile, repository._id);
	}

	// descargar archivo
	const downloadFile = (file, content) => {
		download(file, content);
	}
	// Colocar lista de archivos en la interfaz
	const FilesList = () => {
		return (
		<div class="relative scroll-pb-6 size-[500px]">
		  <ul role="list" class="p-6 divide-y divide-slate-100 bg-white text-black">
			{files.map((file, index) => (
			  <li class="group/item flex py-4 first:pt-0 last:pb-0">
				<div className="w-full cursor-pointer">
				  	<p class="text-sm font-medium text-slate-900">📂 {file.name}</p>
				</div>
				<a class="group/edit invisible hover:bg-slate-200 group-hover/item:visible" onClick={e => downloadFile(file.name, file.content)}>
					<button>Descargar</button>
				</a>
			  </li>
			))}
		  </ul>
		</div>
		)
	  }


	const MenuOptions = () => {
		return (
			<div className="absolute mt-2 w-[200px] rounded-md shadow-lg">
			<ul className="py-1">
				<li>
					<button 
						class="bg-sky-500 hover:bg-sky-700 text-40 inline px-4 py-2 rounded-md my-2"
						onClick={e => navigate(`/repository/${repository._id}/CreateFilePage`, {state: {repository : repository}})}>
						Crear nuevo archivo
					</button>
				</li>
				<li>
					<button 
						class="bg-sky-500 hover:bg-sky-700 text-40 inline px-4 py-2 rounded-md my-2" 
						onClick={addFile}>
						Añadir archivo 
					</button>
				</li>
				<li>
					<button 
						class="bg-sky-500 hover:bg-sky-700 text-40 inline px-4 py-2 rounded-md my-2" 
						onClick={downloadFile}> 
						Descargar 
					</button>
				</li>
			</ul>
		</div>
		)
	  }

	const FileBrowser = () => {
		return (
			<form class="flex items-center space-x-6">
				<div class="shrink-0">
					<img class="h-16 w-16 object-cover rounded-full" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80" alt="Current profile photo" />
				</div>
				<label class="block">
					<span class="sr-only">Choose profile photo</span>
					<input type="file" onChange={e => filess(e.target.files)}
					class="block w-full text-sm text-slate-500
					file:mr-4 file:py-2 file:px-4
					file:rounded-full file:border-0
					file:text-sm file:font-semibold
					file:bg-violet-50 file:text-violet-700
					hover:file:bg-violet-100
					"/>
				</label>
			</form>
		)
	}
	// Interfaz
	return (
		<div className='relative text-white bg-zinc-800 flex flex-col m-auto h-screen'>
			<div class="absolute top-0 right-0 ide-sm hide-md mb-1 d-flex flex-justify-between flex-items-center">
				<a href="/" class="group block w-30 h-25 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">					
					<h3 class="flex space-x-3text-slate-900 group-hover:text-white text-sm font-semibold">🏠 Volver a Página Principal</h3>	
				</a>
			</div>
			<h1 class="text-[40px]">{repository.name}</h1>
			<p class="text-[20px]">Rama actual: Master</p>
			<h2>Usuario: {username}</h2>
            

			<div class="relative top-[120px]">
				<button onClick={toggleMenu}
        		className="inline-flex px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
      			>
					Opciones
					<svg
					className={`w-5 h-5 ml-2 transform ${isOpen ? "rotate-180" : "rotate-0"}`}
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
					</svg>
      			</button>
				{isOpen && (
					<MenuOptions/>
				)}
			</div>
			

			<div class="relative">
				<FileBrowser/>
			</div>
			<div class="relative bg-zinc-800 bottom-[80px] rounded-md flex flex-col m-auto">
				<h1>Archivos</h1>
				<FilesList/>
			</div>
	  </div>
	);
}
export default RepositoryPage
