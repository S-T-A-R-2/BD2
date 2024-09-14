import {authRequired} from '../middlewares/validateToken.js'
import {Router} from 'express'
import {createFile} from '../controllers/files.controller.js'

const router = Router();


router.post('/repositories/:id/create', authRequired, createFile);


export default router;