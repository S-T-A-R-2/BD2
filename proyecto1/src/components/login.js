import React, {useState} from 'react'
import { Button,TextField } from './pruebas.js';
import { BrowserRouter as Router, Link, Switch, Routes, Route } from 'react-router-dom';
import { MainWindow } from './MainWindow.js';
export const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const ValidateUser = (user, pass) => {
		//llamar a la base de datos
		var a = 9
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
				<Button onClick = {ValidateUser} args = {[username, password]}/>
				<Link to="/main">MainWindow</Link>
			</div>
	);
}