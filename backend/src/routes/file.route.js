import {authRequired} from '../middlewares/validateToken.js'
import {Router} from 'express'
import {createFile} from '../controllers/repositories.controller.js'

const router = Router();

router.post('repository/:id', authRequired, createFile);

export default router;