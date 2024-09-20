import {Router} from 'express'
import {getCommits, 
        //getCommit,
        createCommits,/*,
        deleteCommits,*/
        updateCommits} from '../controllers/commits.controller.js'
import {authRequired} from '../middlewares/validateToken.js'
const router = Router();



// CRUD
router.get('/repositories/:id/commits', getCommits);
//router.get('/repositories/:id/commits/:id', getCommit);
router.post('/repositories/:id/commits', authRequired, createCommits);         //authRequired
//router.delete('/repositories/:id/commits/:id', authRequired, deleteCommits);   //authRequired
router.put('/repositories/:id/commits', authRequired, updateCommits);      //authRequired


export default router;
