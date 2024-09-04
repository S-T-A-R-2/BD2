import React, {useState} from 'react'
import { Button,TextField } from './pruebas.js';
import { BrowserRouter as Router, Link, Switch, Routes, Route } from 'react-router-dom';
import { MainWindow } from './MainPage.js';
export const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const ValidateUser = (user, pass) => {
		//llamar a la base de datos
		var a = 9
		alert("No hay sistema");
	}
	//Imprimir error
	return (
			<div>
				<h1>Digite su nombre de usuario</h1>
				<h1>Login Épico</h1>
				<TextField oldText = {username} onChange = {setUsername}/> <p>Usuario: {username}</p>
				<br />
				<TextField oldText = {password} onChange = {setPassword}/> <p>Pass: {password}</p>
				<br />
				<Button text = "Iniciar sesión" onClick = {ValidateUser} args = {[username, password]}/>
			</div>
	);
}
