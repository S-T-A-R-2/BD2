import React, {useState, useEffect} from 'react'
import { getRepository, getBranches, updateBranches, createCommits, updateCommits, getCommits } from '../api/auth';
import { useLocation, useNavigate }  from 'react-router-dom';
import { Dropdown, FileBrowser, Button } from '../components/Dropdown.js';
import { useAuth } from '../context/AuthContext.jsx'

export const AddFilesPage = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [repository, setRepository] = useState(null);
    const [branches, setBranches] = useState(null);
    const [id, setID] = useState(() => {
        const savedRepository = localStorage.getItem('repositoryId');
        return savedRepository ? JSON.parse(savedRepository) : null;
    });

    const [repositoryDescription, setRepositoryDescription] = useState(() => {
        const savedRepository = localStorage.getItem('repository');
        return savedRepository ? JSON.parse(savedRepository) : null;
    });

    useEffect(() => {
		const getBranchesAux = async () => {
			if (id) {
				const dataT = (await getBranches({repositoryId : id})).data;
				setBranches(dataT.branches);
                setRepository(dataT);
			}
		}
		getBranchesAux();
	}, [id]);
    
    const [current, setCurrent] = useState(() => {
        const savedRepository = localStorage.getItem('currentBranch');
        return savedRepository ? JSON.parse(savedRepository) : null;
    });
    
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filesContent, setFilesContent] = useState([]);
	
    /* Lee cada documento cargado en la interfaz y crea su estructura
     * para ser almacenado */
    const handleFileChange = (event) => {
        const files = event.target.files;
        const fileArray = Array.from(files);
        
        const reader = new FileReader();
        fileArray.forEach(file => {
            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1];
                setFilesContent(prev => [...prev,
                {   filename: file.name,
                    version: 0,
                    _attachments: {
                        [file.name] : {
                        contentType: file.type,
                        data: base64String}
                    }
                }]);
            };
            reader.readAsDataURL(file);
        });
        setSelectedFiles(fileArray);
    };

    const [commits, setCommits] = useState([]);
    const [documentCommits, setDocumentCommits] = useState(null)
    
    /* Construye el id del documento */
    useEffect(() => {
        const getCommitsAux = async () => {
            const commitsId = {
                id: repositoryDescription.owner + "/" + repositoryDescription.name + "/" + branches[current].name
            };
            
            setDocumentCommits((await getCommits(commitsId, id)).data);
        }
        if (repositoryDescription && branches){
            getCommitsAux();
        }
    }, [repositoryDescription, branches])

    /* Estructura de cada commit */
    const preCommit = (oldFile, newFile) => {
        if (oldFile) {
            newFile.version = oldFile.version + 1;
        }
        const currentTime = new Date().toLocaleTimeString();
        const commit = {
            description: "actualizar",
            user: user.username,
            version: newFile.version,
            date: currentTime,
            data: newFile._attachments[newFile.filename].data
        };
        const file = {
            filename : newFile.filename,
            commits : [commit]
        }
        if (!oldFile){
            setCommits(prev => [...prev, file]);
        }else{
            const addCommitToFile = (documentCommits.files.find(f => f.filename == newFile.filename))
            addCommitToFile.commits = [...addCommitToFile.commits, commit]
        }
    }

    /* Revisa cuales archivos ya se encuentran en la base de datos*/
    useEffect(() => {
        if (filesContent.length > 0) {
            branches[current].files.forEach(file => {
                const updatedFile = (filesContent.find(f => f.filename == file.filename))
                if (updatedFile){
                    setFilesContent(filesContent.filter(f => f.filename !== file.filename));
                    preCommit(file, updatedFile);
                    file._attachments.data = updatedFile._attachments.data;
                    file.version = file.version + 1;
                }
            })
            /* Hace la estructura del commit para cada archivo*/
            filesContent.forEach(file => {
                preCommit(null, file);
            });
        }

    }, [filesContent, branches])

    /* Guarda el archivo y hace el commit a la base de datos CouchDB */
    const commitAction = async () => {
        
        /* Creación del archivo en la rama y commits */
        repository.branches[current].files = [...branches[current].files, ...filesContent]
        await updateBranches(repository, id);
        documentCommits.files = [...documentCommits.files, ...commits];
        await updateCommits(documentCommits, id, documentCommits._id);
    }
    return (
        <div className='relative text-white bg-zinc-800 flex flex-col m-auto h-screen'>
            <p>Hola mundo</p>
            <div className='relative m-auto'>
				{/*<p>Sección de commits</p>*/}
				
					<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="multiple_files">
                        Upload multiple files
                    </label>
                    <input 
                        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                        id="multiple_files" 
                        type="file" 
                        multiple
                        onChange={handleFileChange}
                    />
                    <ul>
                        {selectedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                    <input type="text" className='text-black' placeholder='Mensaje de commit'/>
					<Button text="commit" onClick={commitAction}/>
			</div>
        </div>
        
    )
}

export default AddFilesPage