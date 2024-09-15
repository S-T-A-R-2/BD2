import {authRequired} from '../middlewares/validateToken.js'
import {Router} from 'express'
import {createBranches, getBranches, updateBranches} from '../controllers/branches.controller.js'

const router = Router();


router.post('/repositories/:id/create_branches', authRequired, createBranches);
router.get('/repositories/:id/create_branches', authRequired, getBranches);
router.put('/repositories/:id/create_branches', authRequired, updateBranches);
export default router;