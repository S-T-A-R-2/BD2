import {authRequired} from '../middlewares/validateToken.js'
import {Router} from 'express'
import {createFile, getFiles, deleteFile} from '../controllers/files.controller.js'

const router = Router();


router.post('/repositories/:id/create', authRequired, createFile);
router.get('/repositories/:id/create', authRequired, getFiles);
router.put('/repositories/:id/delete', deleteFile);

export default router;