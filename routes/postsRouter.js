const { Router } = require('express');
const controller = require('../controllers/posts-controller');
const authVerificator = require('../utils/authVerificator');
const access = require('../utils/accessCheck');

const router = Router();

router.get('/', access, controller.getAllPosts);
router.get('/:postId', controller.getPostById);
router.get('/:postId/comments', controller.showComments);
router.post('/:postId/comments', authVerificator, controller.addComment);
router.get('/:postId/categories', controller.getPostCategories);
router.get('/:postId/like', controller.getPostLikes);
router.post('/', authVerificator, controller.createPost);
router.post('/:postId/like', authVerificator, controller.setLike);
router.post('/:postId/dislike', authVerificator, controller.setDislike);
router.patch('/:postId', authVerificator, controller.changePost);
router.delete('/:postId', authVerificator, controller.deletePost);
router.delete('/:postId/like', authVerificator, controller.deleteLike);

module.exports = router;