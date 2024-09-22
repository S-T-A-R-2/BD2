import React, {useState, useEffect, useRef} from 'react'
import { useLocation, useNavigate }  from 'react-router-dom';
import { updateBranches, getBranches, subscribe, checkSubscription,
         getCommits, getFileCommits, createCommits, updateCommits, makeLike, unmakeLike, makeDislike,
         unmakeDislike, getLiked, getDisliked, getVotes, deleteFile } from '../api/auth.js';

import { Dropdown, FileBrowser} from '../components/Dropdown.js';
import Dialog from '../components/Dialog.jsx'

import {Input, Button} from '../components/Templates.js'



const LikeDislikeButtons = ({ user, repository }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [votes, setVotes] = useState(0);
  const parameters = {username: user.username, repoName: repository.name, ownerName: repository.owner}; 

  useEffect( () => {
    const fetchLikeDislikeStatus = async () => {
      try {
        const likedResponse = await getLiked(parameters);
        const dislikedResponse = await getDisliked(parameters);

        setIsLiked(likedResponse.data.liked);
        setIsDisliked(dislikedResponse.data.disliked);
      } catch (error) {
        console.error('Error fetching like/dislike status:', error);
      }
    };

    const fetchVotes = async () =>{
      try{
        const ammount = await getVotes(parameters);
        console.log(ammount);
        setVotes(ammount.data.final);
      } catch (err) {
        console.log('Error fetching votes', err);
      }
    }
    
    fetchVotes();
    fetchLikeDislikeStatus();
  }, [user, repository]);
  
  const handleMakeLike = async () => {
    setIsLiked(true);
    setIsDisliked(false);
    await makeLike(parameters);
  };

  const handleUnmakeLike = async () => {
    setIsLiked(false);
    await unmakeLike(parameters);
  };

  const handleMakeDislike = async () => {
    setIsDisliked(true);
    setIsLiked(false);
    await makeDislike(parameters);
  };

  const handleUnmakeDislike = async () => {
    setIsDisliked(false);
    await unmakeDislike(parameters);
  };

  return (
    <div className="relative flex flex-row space-x-2">
      <button
        onClick={isLiked ? handleUnmakeLike : handleMakeLike}
        className={`px-4 py-2 rounded transition duration-200 ${
          isLiked ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'
        } hover:bg-blue-500`}
      >
        {isLiked ? 'Unlike' : 'Like'}
      </button>
      <button
        onClick={isDisliked ? handleUnmakeDislike : handleMakeDislike}
        className={`px-4 py-2 rounded transition duration-200 ${
          isDisliked ? 'bg-red-600 text-white' : 'bg-gray-300 text-black'
        } hover:bg-red-500`}
      >
        {isDisliked ? 'Remove Dislike' : 'Dislike'}
      </button>
      <p className="inline px-4 py-2">{votes}</p>
    </div>
  );
};


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
	const location = useLocation();
  const [user, setUser] = useState(location.state ? location.state.user : null);
	const [subscribed, setSubscribed] = useState(" ");
	//notOwner = false : usuario actual es el dueño (desactiva opcion de suscribirse)
	const [notOwner, setNotOwner] = useState(true);
	
	const [branchesDocument, setBranchesDocument] = useState(null);

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
					const response = (await getBranches({ repositoryId: repository._id })).data;
					
					setBranchesDocument(response);
					if (response && response.branches) {
						setBranches(response.branches);
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
			setNotOwner(false);
		} else 
		if (user && repository) {
			checkSubscription(user.username, repository.name, repository._id).then(function(res) {
				setSubscribed(res.data.message);
			})
		} 
	}

	/******************************Descargar archivos*****************************/
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
       	const attachment = fileA._attachments[fileA.name];
        const file = b64toBlob(attachment.data, attachment.content_type);
        
		const element = document.createElement('a');
        element.href = URL.createObjectURL(file);
        element.download = fileA.name;
        
        document.body.appendChild(element);
        element.click();
        
		//https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);
    }

	/******************************Borrar archivos*****************************/
	const handleDeleteFile = (index) => {
		deleteFile(files[index].filename, repository._id, branch.name);
	}

	/*****************************************************************************/
	/**********************************Listas de objetos**************************/
	const [currentFile, setCurrentFile] = useState(null);
	const [displayVersion, setDisplayVersion] = useState(false);
	
	async function toggleVersions(file){
		const idBranch = repository.owner + "/" + repository.name + "/" + branch.name;
		const response = (await getFileCommits({filename : file.filename, branch : idBranch}, repository._id)).data;
		setCurrentFile({
			filename : file.filename,
			name : file.name,
			contentType : file._attachments[file.name].contentType,
			commits: response
		});

	}

	// Obtener el documento de commits de CouchDB
	const [documentCommits, setDocumentCommits] = useState(null)
    useEffect(() => {
        const getCommitsAux = async () => {
            const commitsId = {
                id: repository.owner + "/" + repository.name + "/" + branch.name
            };
            setDocumentCommits((await getCommits(commitsId, repository._id)).data);
        }
        if (repository && branches){
            getCommitsAux();
        }
    }, [repository, branches])
	
	const preCommit = async (oldFile, newFile) => {
        const commit = {
            description: "Rollback archivo " + oldFile.name + " a la versión " + newFile.version,
            user: user.username,
            version: oldFile.version + 1,
            date: new Date().toLocaleTimeString(),
            data: newFile._attachments[newFile.name].data
        };
        const addCommitToFile = (documentCommits.files.find(f => f.filename == newFile.filename))
        addCommitToFile.commits = [...addCommitToFile.commits, commit]
		await updateCommits(documentCommits, repository._id, documentCommits._id);
    }

	async function rollBackFile (oldFile) {
		const currentFile = (branch.files.find(f => f.filename == oldFile.filename))
		Object.assign(currentFile, oldFile);//reemplazar archivo en el documento de la rama
		currentFile.version = currentFile.version + 1;
		preCommit(currentFile, oldFile);//hacer commit del rollback
		await updateBranches(branchesDocument, repository._id);
	}
	
	
	
	useEffect(()=> {
		if (currentFile) {
			const ModalFileVersion = () => {
				return (
					<div className="relative scroll-pb-6 size-[500px]">
						<p>Archivo: {currentFile.filename}</p>
						<ul role="list" className="p-2 divide-y divide-slate-100 bg-white text-black">
							{currentFile.commits.map((commit, index) => (
								<li key={index} className="group/item flex py-4 first:pt-0 last:pb-0">
									<div className="w-full cursor-pointer" >
										<p className="text-sm font-medium text-slate-900">Versión: {commit.version}</p>
									</div>
									<div className="flex flex-col">
										<a className="text-sm group/edit invisible hover:bg-slate-200 group-hover/item:visible"
											onClick={e => downloadFile({
												filename: currentFile.filename,
												name: currentFile.name,
												version: commit.version,
												_attachments: {
													[currentFile.name] : {
													contentType: currentFile.contentType,
													data: commit.data}
												}
											})}
										>
											<button>Descargar</button>
										</a>
										<a className="text-sm group/edit invisible hover:bg-slate-200 group-hover/item:visible"
											onClick={e => rollBackFile({
												filename: currentFile.filename,
												name: currentFile.name,
												version: commit.version,
												_attachments: {
													[currentFile.name] : {
													contentType: currentFile.contentType,
													data: commit.data}
												}
											})}
										>
											<button>Rollback</button>
										</a>
									</div>
								</li>
							))}
						</ul>
					</div>
				)
			}
			setDisplayVersion(prev => !prev);
			setDialogContent(<ModalFileVersion />);
			toggleDialog();
		}
	}, [currentFile])



	// Colocar lista de archivos en la interfaz
	const FilesList = () => {
		const navigate = useNavigate();

		const handleFileClick = (file) => {
			navigate(`/repository/${repository._id}/FilePage`, { state: { file, repository } });
		};

		return (
			<div className="relative scroll-pb-6 size-[500px] overflow-y-scroll border border-black">
				<ul role="list" className="p-2 divide-y divide-slate-100 bg-white text-black">
					{displayedFiles.map((file, index) => (
						<li key={index} className="group/item flex py-4 first:pt-0 last:pb-0">
							<div className="w-full cursor-pointer" onClick={() => handleFileClick(file)}>
								<p className="text-sm font-medium text-slate-900">📂 {file.filename}</p>
							</div>
							<div className="flex flex-col">
								<a className="text-sm group/edit invisible hover:bg-slate-200 group-hover/item:visible" onClick={e => downloadFile(file)}>
									<button>Descargar</button>
								</a>
								<a className="text-sm invisible hover:bg-slate-100 group-hover/item:visible">
									<button onClick={e => toggleVersions(file)}>versiones</button>
								</a>
								<a className="text-sm invisible hover:bg-slate-100 group-hover/item:visible">
									<button onClick={e => handleDeleteFile(index)}>borrar</button>
								</a>
							</div>
						</li>
					))}
				</ul>
			</div>
		);
	};

	/*****************************************************************************/
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

	/**************************Menus de opciones**********************************/
	// Para mostrar el menú desplegable
	const [isOpen, setIsOpen] = useState(false);
	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};
	const menuOptions = [
		{ label: 'Crear nuevo archivo', link: '#', onClick: () => navigate(`/repository/${repository._id}/CreateFilePage`, {state: {repository : repository}}) },
		{ label: 'Añadir archivo', link: '#', onClick: () => addFilesA()},
		{ label: 'Crear nueva rama', onClick: () =>{
			setDialogContent(<ModalCreateBranch />);
			toggleDialog();
		}},
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
	/*****************************************************************************/	
	let displayedFiles = files;
	/**************************Crear nueva rama***********************************/
	const [dialogContent, setDialogContent] = useState(null);
	const dialogRef = useRef(null);
	function toggleDialog(){
		if(!dialogRef.current){
			return;
		}
		dialogRef.current.hasAttribute("open")
			? dialogRef.current.close()
			: dialogRef.current.showModal();

	}

	const [newBranchName, setNewBBranchName] = useState("");
	const branchNameRef = useRef('');

    const handleChange = (e) => {
        setNewBBranchName(e.target.value);
        branchNameRef.current = e.target.value;
    };
	const ModalCreateBranch = () => {
		return (
			<div>
				<p>Ingrese el nombre de la nueva rama:</p>
				<input type="text"
          				className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
						placeholder="nombre de la rama"
						onChange={e => handleChange(e)}/>
				<button onClick={async () => { console.log("Se presiona"); (await createNewBranch(branchNameRef.current));}}>Crear rama</button>
			</div>
		)
	}
	const createNewBranch = async (newBranchName) => {
		if(newBranchName) {
			const newBranch = {
				name: newBranchName,
				files: branches[0].files
			}
			setBranches([...branches, newBranch]);
			branchesDocument.branches = [...branches, newBranch];
			await updateBranches(branchesDocument, branchesDocument._id);
			// Crear commit
			const sourceBranch = {id: repository.owner + "/" + repository.name + "/" + "master"};
			const sourceBranchCommits = (await getCommits(sourceBranch, repository._id)).data;
			const destinationBranch = repository.owner + "/" + repository.name + "/" + newBranchName;
			const destinationBranchCommits = {
				_id : destinationBranch,
				files : sourceBranchCommits.files
			}
			await createCommits(destinationBranchCommits, repository._id);
		}
	}
	/*****************************************************************************/
	/***********************************Interfaz**********************************/
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
			(subscribed === "Suscrito" || notOwner === false) && 
			<div className = "relative top-[100px] flex flex-row">
				<Dropdown 
					buttonText="Opciones" 
					action={toggleMenu} 
					isActive={isOpen} options={menuOptions}
				/>
				<Dropdown 
					buttonText="Ramas" 
					action={toggleBranchMenu} 
					isActive={isOpenBranchMenu} options={menuBranchOptions}
				/>
				<div className='flex'>
					<Button 
						text="historial de commits" 
						onClick={e => console.log("Hola")}
					/>
					{(branch.name !== "master") && (
					<Button 
						text={mergeText} 
						onClick={merge}
						args={[branch, branches[0]]}
					/>
					)}
				</div>
			</div>
			)}

      {( (user && repository) && <LikeDislikeButtons user = {user} repository={repository}/> )}

			<div class="relative bg-zinc-800 left-[50px] rounded-md flex flex-row m-auto">
				<div class="relative bg-zinc-800 rounded-md flex flex-col m-auto">
					<h1>Archivos</h1>
					<FilesList/>
				</div>
			</div>
			<dialog
            	ref={dialogRef}
			>
				<div className='bg-zinc-800 m-auto text-white shadow-lg rounded-lg m-auto p-6 max-w-lg'>
					{dialogContent}
					<Button onClick={toggleDialog} text={"Cerrar"}/>
				</div>
			</dialog>

			
	  </div>
	  /*****************************************************************************/
	);
	async function merge (source, destination) {
		const destinationId = {
			id: repository.owner + "/" + repository.name + "/" + "master"
		};
		const sourceId = {
			id: repository.owner + "/" + repository.name + "/" + branch.name
		};
		const masterCommit = (await getCommits(destinationId, repository._id)).data;
		const sourceCommit = (await getCommits(sourceId, repository._id)).data;
		
		source.files.forEach(file => {
			const destinationFile = destination.files.find(f => f.filename === file.filename);
			if (destinationFile && destinationFile.version < file.version) {
				Object.assign(destinationFile, file);
			}
			if (!destinationFile){
				destination.files = [...destination.files, file];
				const fileSourceCommits = sourceCommit.files.find(f => f.filename === file.filename);
				masterCommit.files = [...masterCommit.files, fileSourceCommits];
			}
		});	
		await updateCommits(masterCommit,  repository._id);
	}
}

export default RepositoryPage
