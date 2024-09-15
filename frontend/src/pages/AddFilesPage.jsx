import React, {useState, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import { getRepository, getBranches, updateBranches } from '../api/auth';
import { useLocation, useNavigate }  from 'react-router-dom';
import { Dropdown, FileBrowser, Button } from '../components/Dropdown.js';
export const AddFilesPage = () => {
    console.log("Hola");
    const location = useLocation();
    const [repository, setRepository] = useState(null);
    const [branches, setBranches] = useState(null);
    const [id, setID] = useState(() => {
        const savedRepository = localStorage.getItem('repositoryId');
        return savedRepository ? JSON.parse(savedRepository) : null;
    });
    useEffect(() => {
		const getBranchesAux = async () => {
			if (id) {
				const dataT = (await getBranches({repositoryId : id})).data[0];
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
	
    const handleFileChange = (event) => {
        const files = event.target.files;
        const fileArray = Array.from(files);
        
        fileArray.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFilesContent(prev => [
                    ...prev,
                    {filename: file.name, content: e.target.result}
                ]);
            };
            reader.readAsText(file);
        });
        setSelectedFiles(fileArray);
    };
    const commitAction = async () => {
        repository.branches[current].files = [...branches[current].files, ...filesContent]
        console.log("Ahí viene");
        console.log(await updateBranches(repository, id));
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