import {Router} from 'express'
import {register} from '../controllers/auth.controller.js'

const router = Router();

// CRUD
router.post('/register', register);
/*
router.get('/repositories', getRepositories);
router.get('/repositories/:id', getRepository);
router.post('/repositories', createRepository);
router.delete('/repositories/:id', deleteRepository);
router.put('/repositories/:id', updateRepository);
*/

export default router;