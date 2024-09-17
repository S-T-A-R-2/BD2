import {Router} from 'express'
import {createUser} from '../controllers/graph.controller.js'

const router = Router();

router.post('/create-user', createUser);

export default router;