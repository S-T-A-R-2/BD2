import logo from './logo.svg';
import './App.css';
//Importo la cosa para poder usar los componentes que puse ahí
import { BrowserRouter as Router, Link, Routes, Route, BrowserRouter } from 'react-router-dom';
import { Button,TextField } from './components/pruebas.js';
import {AuthProvider} from './context/AuthContext.jsx'

import LoginPage from './pages/LoginPage.jsx';
import MainPage from './pages/MainPage.js';
import RegisterPage from './pages/RegisterPage';
import NewRepositoryPage from './pages/NewRepositoryPage.jsx'
import SeachRepositoryPage from './pages/SearchRepositoryPage.jsx'
import { RepositoryPage } from './pages/RepositoryPage.jsx';
import CreateFilePage from './pages/CreateFilePage.jsx';
import ProtectedRoute from './pages/ProtectedRoutes.jsx'

/*<div>
          <Link to="/main">MainWindow</Link>
          <Link to="/login"><Button text = "Login" args = {[]} /> </Link>
        </div>*/
function App() {
  return (
    <div className='bg-zinc-800'>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element = {<MainPage />} />
            <Route path="/register" element = {<RegisterPage />} />
            <Route path="/login" element = {<LoginPage />} />
            <Route path="/searchRepository" element = {<SeachRepositoryPage/>}/>
            <Route path="/repository/:id" element = {<RepositoryPage/>}/>
            <Route path="/repository/:id/CreateFilePage" element = {<CreateFilePage/>}/>
            <Route element={<ProtectedRoute />}>
              <Route path="/newRepository" element = {<NewRepositoryPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
