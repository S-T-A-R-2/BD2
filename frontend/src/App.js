import './App.css';
import { BrowserRouter as Router, Link, Routes, Route, BrowserRouter } from 'react-router-dom';
import {AuthProvider} from './context/AuthContext.jsx'

import LoginPage from './pages/LoginPage.jsx';
import MainPage from './pages/MainPage.js';
import RegisterPage from './pages/RegisterPage';
import NewRepositoryPage from './pages/NewRepositoryPage.jsx'
import SeachRepositoryPage from './pages/SearchRepositoryPage.jsx'
import { RepositoryPage } from './pages/RepositoryPage.jsx';
import CreateFilePage from './pages/CreateFilePage.jsx';
import ProtectedRoute from './pages/ProtectedRoutes.jsx'
import AddFilesPage from './pages/AddFilesPage.jsx';
import FilePage from './pages/FilePage.jsx';

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
            <Route path="/repository/:id/AddFilePage" element = {<AddFilesPage/>}/>
            <Route path="/repository/:id/FilePage" element = {<FilePage/>}/>
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
