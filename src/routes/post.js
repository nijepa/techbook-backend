import Router from 'express';
import { post_list, 
          post_user_list,
          post_one, 
          post_add, 
          post_comment, 
          post_comment_delete,
          post_update, 
          post_delete,
          post_like,
          post_dislike,
          comment_like } from '../controllers/post.js'
import auth from '../middleware/auth.js';

const router = Router();

/* List of all posts */
router.get('/:page', post_list);
router.get('/user/:userId', post_user_list);
router.get('/:postId', post_one);
router.post('/', auth, post_add);
router.post('/comment', auth, post_comment);
router.put('/comment/:commentId',auth, post_comment_delete);
router.put('/:postId', auth, post_update);
router.delete('/:postId',auth, post_delete);
router.post('/like/:postId', auth, post_like);
router.post('/dislike/:postId', auth, post_dislike);
router.post('/comment/like/:commentId', auth, comment_like);

export default router;