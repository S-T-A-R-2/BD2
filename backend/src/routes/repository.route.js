import {Router} from 'express'
import {getRepositories, 
        getRepository, 
        createRepository,
        updateRepository,
        deleteRepository} from '../controllers/repositories.controller.js'

const router = Router();

// CRUD
router.get('/repositories', getRepositories);
router.get('/repositories/:id', getRepository);
router.post('/repositories', createRepository);
router.delete('/repositories/:id', deleteRepository);
router.put('/repositories/:id', updateRepository);

export default router;