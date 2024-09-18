import {Router} from 'express'
import {createUser, 
        createRepository, 
        userLikesRepository, 
        userFollowsRepository,
        createCommentOnRepository,
        createCommentOnComment,
        subscribe } from '../controllers/graph.controller.js';
   

const router = Router();

router.post('/create-user', createUser);
router.post('/create-repository', createRepository);
router.post('/user-likes-repository', userLikesRepository);
router.post('/user-follows-repository', userFollowsRepository);
router.post('/create-comment-on-repository', createCommentOnRepository);
router.post('/create-comment-on-comment', createCommentOnComment);
router.post('/repositories/:id', subscribe);

export default router;
