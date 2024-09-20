import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate }  from 'react-router-dom';
import { createFile, getFiles, getBranches, subscribe, checkSubscription } from '../api/auth.js';
import { Dropdown, FileBrowser, Button } from '../components/Dropdown.js';

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
	const [subscribed, setSubscribed] = useState(" ");
	//notOwner = false : usuario actual es el dueño (desactiva opcion de suscribirse)
	const [notOwner, setNotOwner] = useState(true);
	

	useEffect(() => {
		// Recuperar el nombre de usuario del login	
		const storedUsername = localStorage.getItem('user');
		if (storedUsername) {
			setUsername(JSON.parse(storedUsername));
			localStorage.removeItem('loggedIn');
		}
	}, []);

	useEffect(() => {
        const getBranchesAux = async () => {
            if (repository) {
                try {
                    const response = await getBranches({ repositoryId: repository._id });
                    const dataT = response.data;
                    if (dataT && dataT.branches) {
                        setBranches(dataT.branches);
                    } else {
                        console.error('Branches not found in the response');
                    }
                } catch (error) {
                    console.error('Error fetching branches:', error);
                }
            }
        };
        getBranchesAux();
    }, [repository]);

	useEffect(() => {
		if (branches) {
			const current = branches[actualBranch];
			setBranch(current);
			setFiles(current.files);
			updateMenuBranches();
			check();
		}
	}, [branches, actualBranch]);

	//Revisa si el usuario esta suscrito
	const check = () => { 
		if (user && !user.username.localeCompare(repository.owner)) {
			console.log("NO OUNER");
			setNotOwner(false);
		} else 
		if (user && repository) {
			checkSubscription(user.username, repository.name, repository._id).then(function(res) {
				setSubscribed(res.data.message);
			})
		} 
	}


	const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
		const byteCharacters = atob(b64Data); // Decodifica el base64
		const byteArrays = [];
	  
		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);
			const byteNumbers = new Array(slice.length);
			
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}
			
			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}
		
		return new Blob(byteArrays, { type: contentType });
		//https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
	};
	
	const downloadFile = async (fileA) => {
       	const attachment = fileA._attachments[fileA.filename];
        const file = b64toBlob(attachment.data, attachment.content_type);
        
		const element = document.createElement('a');
        element.href = URL.createObjectURL(file);
        element.download = fileA.filename;
        
        document.body.appendChild(element);
        element.click();
        
		//https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);
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
					<a class="text-sm group/edit invisible hover:bg-slate-200 group-hover/item:visible" onClick={e => downloadFile(file)}>
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
		if (user && repository) {
			subscribe(user.username, repository.name, repository._id).then(function(res) {
				setSubscribed(res.data.message);
			});
		} else {
			alert("Debe iniciar sesión para suscribirse");
		}
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
				<p>{subscribed}</p>
				{notOwner && (
				<div style={{marginLeft: '200px'}}>
					<Button text="Suscribirse" onClick={subscribeRepository}/>
				</div>
				)}
            </div>

			{(
				(subscribed=="Suscrito" || notOwner == false) && <div className = "relative top-[100px] flex flex-row">
				<Dropdown buttonText="Opciones" action={toggleMenu} isActive={isOpen} options={menuOptions}/>
				<Dropdown buttonText="Ramas" action={toggleBranchMenu} isActive={isOpenBranchMenu} options={menuBranchOptions}/>
				<></>
				<div className='flex'>
					<Button text="historial de commits" onClick={e => console.log("Hola")}/>
					<Button text={mergeText} onClick={e => console.log("Hola")}/>					
					<input type="text" className='text-black' placeholder='Mensaje de commit'/>
				</div>
			</div>
			)}
			
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
