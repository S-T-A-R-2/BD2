import {Router} from 'express'
import {authRequired} from '../middlewares/validateToken.js';

import {
    register, 
    login, 
    logout,
    profile,
    verifyToken} from '../controllers/auth.controller.js'

 
const router = Router();

// CRUD
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authRequired, profile);
router.get('/verify', verifyToken);

/*
router.get('/repositories', getRepositories);
router.get('/repositories/:id', getRepository);
router.post('/repositories', createRepository);
router.delete('/repositories/:id', deleteRepository);
router.put('/repositories/:id', updateRepository);
*/

export default router;
