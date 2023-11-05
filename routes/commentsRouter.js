const { Router } = require('express');
const controller = require('../controllers/comments-controller');
const authVerificator = require('../utils/authVerificator');

const router = Router();

router.get('/:commentId', controller.getCommentById);
router.get('/:commentId/like', controller.getAllLikes);
router.post('/:commentId/like', authVerificator, controller.setLike);
router.post('/:commentId/dislike', authVerificator, controller.setDislike);
router.patch('/:commentId', authVerificator, controller.changeComment);
router.delete('/:commentId', authVerificator, controller.deleteComment);
router.delete('/:commentId/like', authVerificator, controller.deleteLike);

module.exports = router;