import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate }  from 'react-router-dom';
import { createFile, getFiles, getBranches, subscribe } from '../api/auth.js';
import { Dropdown, FileBrowser, Button } from '../components/Dropdown.js';
import { useAuth } from '../context/AuthContext';

export const RepositoryPage = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState(null);
	const [files, setFiles] = useState([]);
	const [branches, setBranches] = useState(null);
	const [repository, setRepository] = useState(() => {
        const savedRepository = localStorage.getItem('repository');
        console.log(savedRepository);
        return savedRepository ? JSON.parse(savedRepository) : null;
    });
	const [branch, setBranch] = useState("");
	const [menuBranchOptions, setMenuBranchOption] = useState([]);
	const [actualBranch, setActualBranch] = useState(0);
	const [currentFile, setCurrentFile] = useState(0);
	const location = useLocation();
  	const [user, setUser] = useState(location.state ? location.state.user : null);

	useEffect(() => {
		// Recuperar el nombre de usuario del login	
		const storedUsername = localStorage.getItem('user');
		if (storedUsername) {
			setUsername(JSON.parse(storedUsername));
			console.log('Username:', JSON.parse(storedUsername));
			localStorage.removeItem('loggedIn');
		}
	}, []);
	useEffect(() => {
		const getBranchesAux = async (res) => {
			if (repository) {
				const dataT = (await getBranches({repositoryId : repository._id}));
				setBranches(dataT.branches);
				
			}
		}
		getBranchesAux();
	}, [repository]);
	useEffect(() => {
		if (branches) {
			const current = branches[actualBranch];
			setBranch(current);
			setFiles(current.files);
			updateMenuBranches();
		}
	}, [branches, actualBranch]);
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
	
	// descargar archivo
	const downloadFile = (file, content) => {
		download(file, content);
	}
	// Colocar lista de archivos en la interfaz
	const FilesList = () => {
		return (
			<div class="relative scroll-pb-6 size-[500px]">
		  	<ul role="list" class="p-2 divide-y divide-slate-100 bg-white text-black">
			{files.map((file, index) => (
			  <li class="group/item flex py-4 first:pt-0 last:pb-0">
				<div className="w-full cursor-pointer">
				  	<p class="text-sm font-medium text-slate-900">📂 {file.filename}</p>
				</div>
				<div class="flex flex-col">
					<a class="text-sm group/edit invisible hover:bg-slate-200 group-hover/item:visible" onClick={e => downloadFile(file.filename, file.content)}>
						<button>Descargar</button>
					</a>
					<a class="text-sm invisible hover:bg-slate-100 group-hover/item:visible">
						<button onClick={e => setCurrentFile(index)}>comentarios</button>
					</a>
				</div>
			  </li>
			))}
		  	</ul>
			</div>
		)
	}

	const CommentsList = () => {
		if (files.length > 0) {
			console.log(files[currentFile].comments);
			return (
				<div class="relative scroll-pb-6 size-[500px]">
				  <ul role="list" class="p-6 divide-y divide-slate-100 bg-white text-black">
				{files[currentFile].comments.map((comment, index) => (
				  <li class="group/item flex py-4 first:pt-0 last:pb-0">
					<div className="w-full cursor-pointer">
						  <p class="text-sm font-medium text-slate-900">Fecha de creación: {comment.date}</p>
						  <p class="text-sm font-medium text-slate-900">Usuario: {comment.userId}</p>
						  <p class="text-sm font-medium text-slate-900">{comment.description}</p>
					</div>
					<a class="group/edit invisible hover:bg-slate-200 group-hover/item:visible" onClick={e => console.log(comment.date)}>
						<button>Descargar</button>
					</a>
				  </li>
				))}
				  </ul>
				</div>
			)
		}
		
	}

	// Para mostrar el menú desplegable
	const [isOpen, setIsOpen] = useState(false);
	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};
	
	const addFilesA = () => {
		localStorage.setItem('currentBranch', JSON.stringify(actualBranch));
		localStorage.setItem('repositoryId', JSON.stringify(repository._id));
		navigate(`/repository/${repository._id}/AddFilePage`);
	}

	const subscribeRepository = () => {
		subscribe(user, repository.name, repository._id);
	}

	const menuOptions = [
		{ label: 'Crear nuevo archivo', link: '#', onClick: () => navigate(`/repository/${repository._id}/CreateFilePage`, {state: {repository : repository}}) },
		{ label: 'Añadir archivo', link: '#', onClick: () => addFilesA()},
		{ label: 'Descargar', link: '#', onClick: () =>  downloadFile()},
		{ label: 'Crear nueva rama', onClick: () => createNewBranch()},
		{ label: 'Suscribirse', onClick: () => subscribeRepository()}
	];

	const [isOpenBranchMenu, setIsOpenBranchMenu] = useState(false);
	const toggleBranchMenu = () => {
		setIsOpenBranchMenu(!isOpenBranchMenu);
	};
	
	function updateMenuBranches(){
		const options = branches.map((branch, index) => ({
			label: branch.name,
			onClick: () => setActualBranch(index)
		}));
		setMenuBranchOption(options);
	}
	const createNewBranch = () => {
		const newBranch = {
			name: "nueva rama",
			files: [
			  {
				filename: "NuevaRama.md",
				content: "Soy un readme",
				comments: [
				  {
					userId: "567",
					date: "13-09-2024",
					description: "Soy un nuevo comentario"
				  }
				]
			  }
			]
		}
		console.log("Holaaaa")
		setBranches([...branches, newBranch]);
	}

	// Interfaz
	const mergeText = `merge ${branch.name} to master`
	return (
		<div className='relative text-white bg-zinc-800 flex flex-col m-auto h-screen'>
			<div class="absolute top-0 right-0 ide-sm hide-md mb-1 d-flex flex-justify-between flex-items-center">
				<a href="/" class="group block w-30 h-25 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">					
					<h3 class="flex space-x-3text-slate-900 group-hover:text-white text-sm font-semibold">🏠 Volver a Página Principal</h3>	
				</a>
			</div>
			<div>
				<h1 class="text-[40px]">{repository.name}</h1>
				<p class="text-[20px]">Rama actual: {branch.name}</p>
				<h2>Usuario: {username}</h2>
				<p>{repository.description}</p>
            </div>

			<div className = "relative top-[100px] flex flex-row">
				<Dropdown buttonText="Opciones" action={toggleMenu} isActive={isOpen} options={menuOptions}/>
				<Dropdown buttonText="Ramas" action={toggleBranchMenu} isActive={isOpenBranchMenu} options={menuBranchOptions}/>
				<></>
				<div className='flex'>
					<Button text="historial de commits" onClick={e => console.log("Hola")}/>
					<Button text={mergeText} onClick={e => console.log("Hola")}/>					
					<input type="text" className='text-black' placeholder='Mensaje de commit'/>
				</div>
			</div>
			
			
			<div class="relative bg-zinc-800 left-[50px] rounded-md flex flex-row m-auto">
				<div class="relative bg-zinc-800 rounded-md flex flex-col m-auto">
					<h1>Archivos</h1>
					<FilesList/>
				</div>
				<div class="relative left-[20px] bg-zinc-800 rounded-md flex flex-col m-auto">
					<h1>Comentarios</h1>
					<CommentsList/>
				</div>
			</div>
			
	  </div>
	);
}
export default RepositoryPage