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
        <Link to="/main">MainWindow</Link>
        <Link to="/login"><Button text = {"Login"}/> </Link>
      </div>
      <Routes>
				<Route path="/main" element = {<MainWindow />} />
        <Route path="/login" element = {<Login />} />
			</Routes>
    </Router>
  );
}

export default App;
