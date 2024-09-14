import {Router} from 'express'
import {getRepositories, 
        getRepository, 
        createRepository,
        updateRepository,
        deleteRepository} from '../controllers/repositories.controller.js'
import {authRequired} from '../middlewares/validateToken.js'
const router = Router();



// CRUD
router.get('/repositories', getRepositories);
router.get('/repositories/:id', getRepository);
router.post('/repositories', authRequired, createRepository);         //authRequired
router.delete('/repositories/:id', authRequired, deleteRepository);   //authRequired
router.put('/repositories/:id', authRequired, updateRepository);      //authRequired


export default router;
