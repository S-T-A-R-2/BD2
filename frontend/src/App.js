import logo from './logo.svg';
import './App.css';
//Importo la cosa para poder usar los componentes que puse ahí
import { BrowserRouter as Router, Link, Routes, Route, BrowserRouter } from 'react-router-dom';
import { Button,TextField } from './components/pruebas.js';
import { LoginPage } from './pages/LoginPage.js';
import { MainPage } from './pages/MainPage.js';
import { RegisterPage } from './pages/RegisterPage.jsx';
/*<div>
          <Link to="/main">MainWindow</Link>
          <Link to="/login"><Button text = "Login" args = {[]} /> </Link>
        </div>*/
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Routes>
          <Route path="/" element = {<MainPage />} />
          <Route path="/register" element = {<RegisterPage />} />
          <Route path="/login" element = {<LoginPage />} />
          <Route path="/repositories" element = {<h1>Repositorios</h1>} />
        </Routes>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
