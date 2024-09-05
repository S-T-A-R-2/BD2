import React, {useState} from 'react'
import { BrowserRouter as Router, Link, Switch, Routes, Route } from 'react-router-dom';
import { MainWindow } from './MainPage.js';
export const LoginPage = () => {
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
				<br />
				<br />
				<button>Login</button>
			</div>
	);
}
export default LoginPage