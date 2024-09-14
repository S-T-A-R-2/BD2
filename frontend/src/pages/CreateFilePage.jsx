import React, {useState, useEffect, useRef} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { createFile } from '../api/auth.js'

export const CreateFilePage = () => {
	const [username, setUsername] = useState(null);
	const [file, setFile] = useState({name : "", content : ""});
	const [files, setFiles] = useState([]);
	const [password, setPassword] = useState("");
	const location = useLocation();
	const [fileName, setFileName] = useState('');
	
	const [repository, setRepository] = useState(location.state ? location.state.repository : null);

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
		let fileObject = {
			_id : fileName,
			content: editorRef.current.getValue()
		};
		createFile(fileObject);
		
	}

	// Añadir archivo a la lista de archivos
	const addFile = () => {
		setFiles([...files, file]);
		console.log(file);
	}

	// Actualizar texto de doc actual
	const editorRef = useRef(null);
	const saveEditorText = (editor, monaco) => {
		editorRef.current = editor;
	}

	// descargar archivo
	const downloadFile = (file, content) => {
		download(file, content);
	}
	// Colocar lista de archivos en la interfaz
	const FilesList = () => {
		console.log(files)
		return (
		  <ul role="list" class="p-6 divide-y divide-slate-200 bg-white max-w-md text-black">
			{files.map((file, index) => (
			  <li class="group/item flex py-4 first:pt-0 last:pb-0">
				<div className="w-full cursor-pointer">
				  <p class="text-sm font-medium text-slate-900">📂 {file.name}</p>
				  
				  <a class="group/edit invisible hover:bg-slate-200 group-hover/item:visible inline" onClick={e => downloadFile(file.name, file.content)}>
						<span class="group-hover/edit:text-gray-700 inline">Call</span>
						<svg class="group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500 inline">
						</svg>
					</a>
				</div>
			  </li>
			))}
		  </ul>
		)
	  }

	// Interfaz
	return (
		<div className='text-white bg-zinc-800 flex  flex-col m-auto h-screen'>
			<h1>Ver repositorio</h1>
			<h2>Usuario: {username}</h2>
            <div class="absolute top-0 right-0 ide-sm hide-md mb-1 d-flex flex-justify-between flex-items-center">
				<a href="/" class="group block w-30 h-25 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">					
					<h3 class="flex space-x-3text-slate-900 group-hover:text-white text-sm font-semibold">🏠 Volver a Página Principal</h3>	
				</a>
			</div>
								
			<div>
				<h1>Añadir</h1>
				
				<button class="bg-sky-500 hover:bg-sky-700">
					<a class="group block w-30 h-25 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">
						<button class="flex space-x-3text-slate-900 group-hover:text-white text-sm font-semibold" onClick={saveFile} >Commit</button>	
					</a>
				</button>

				


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
				<button class="bg-sky-500 hover:bg-sky-700 text-2xl inline px-4 py-2 rounded-md my-2" onClick={downloadFile}> Descargar </button>
				<button class="bg-sky-500 hover:bg-sky-700 text-2xl inline px-4 py-2 rounded-md my-2" onClick={addFile}> Aceptar </button>
				<div minH="100vh" bg="#0fa19" color ="gray.500" px={6} py={8}>
					<label>File name: </label>
					<input type="text" value={fileName} onChange= {(e) => setFileName(e.target.value)}  style={{ color:'black' }}/>
					<Editor height="90vh" defaultLanguage="javascript" defaultvalue="//some comment" onMount={saveEditorText}/>
				</div>
			</div>
			
			<div class="relative right-80 max-w-md bg-zinc-800 p-10 rounded-md flex flex-col m-auto h-screen" justify-center>
				<h1>Archivos</h1>
				<FilesList/>
			</div>
	  </div>
	);
}
// group block absolute w-30 h-25 left-0
export default CreateFilePage
