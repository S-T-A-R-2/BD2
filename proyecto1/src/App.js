import logo from './logo.svg';
import './App.css';
//Importo la cosa para poder usar los componentes que puse ahí
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import { Button,TextField } from './components/pruebas.js';
import { Login } from './components/login.js';
import { MainWindow } from './components/MainWindow.js';
function App() {
  return (
    <Router>
      <div>
        <Login />
        <h1>Hola mundo</h1>
      </div>
      <Routes>
				<Route path="/" element = {<MainWindow />} />
			</Routes>
    </Router>
  );
}

export default App;
