const { Router } = require('express');
const controller = require('../controllers/user-controller');
const authVerificator = require('../utils/authVerificator');
const adminVerificator = require('../utils/adminVerificator');

const router = Router();

router.get('/', controller.getAllUsers);
router.get('/:userId', controller.getUserById);
router.get('/:userId/posts', controller.getPostsByUser);
router.post('/', authVerificator, adminVerificator, controller.createNewUser);
router.patch('/avatar', authVerificator, controller.addAvatar);
router.patch('/:userId', authVerificator, controller.changeUser);
router.delete('/:userId', authVerificator, adminVerificator, controller.deleteUser);

module.exports = router;