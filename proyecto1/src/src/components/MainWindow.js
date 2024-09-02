import React, {useState} from 'react'
import { Button,TextField } from './pruebas.js';

export const MainWindow = () => {
	const [username, setUsername] = useState("Página principal");
	const [password, setPassword] = useState("");
	const ValidateUser = (user, pass) => {
		//llamar a la base de datos
		var a = 9
        alert("Se perdió");
	}
	//Imprimir error
	return (
		<div>
			<h1>Página principal</h1>
			<h1>Mis repositorios</h1>
            <h1>Perfil</h1>
			<br />
			<TextField oldText = {password} onChange = {setPassword}/> <p>Pass: {password}</p>
			<br />
			<Button text = {"Crear repositorio"} onClick = {ValidateUser} args = {[username, password]}/>
		</div>
	);
}