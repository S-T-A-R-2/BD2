import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate }  from 'react-router-dom';
import { createFile, getFiles } from '../api/auth.js';
import { Dropdown, FileBrowser } from '../components/Dropdown.js';

export const RepositoryPage = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState(null);
	const [file, setFile] = useState({name : "", content : ""});
	const [files, setFiles] = useState([]);
	const [password, setPassword] = useState("");
	const location = useLocation();
	const [repository, setRepository] = useState(location.state ? location.state.repository : null);
	const [loadFiles, setLoadFiles] = useState (true);
	
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

	// Para mostrar el menú desplegable
	const [isOpen, setIsOpen] = useState(false);
	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};
	const menuOptions = [
		{ label: 'Crear nuevo archivo', link: '#', onClick: () => navigate(`/repository/${repository._id}/CreateFilePage`, {state: {repository : repository}}) },
		{ label: 'Añadir archivo', link: '#', onClick: () => addFile()},
		{ label: 'Descargar', link: '#', onClick: () =>  downloadFile()}
	];
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
            <Dropdown buttonText="Opciones" action={toggleMenu} isActive={isOpen} options={menuOptions}/>

			<div class="relative">
				<FileBrowser action={filess} label="Selecciona el archivo"/>
			</div>
			<div class="relative bg-zinc-800 bottom-[80px] rounded-md flex flex-col m-auto">
				<h1>Archivos</h1>
				<FilesList/>
			</div>
	  </div>
	);
}
export default RepositoryPage