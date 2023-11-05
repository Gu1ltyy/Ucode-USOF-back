const { Router } = require('express');
const controller = require('../controllers/categories-controller');
const authVerificator = require('../utils/authVerificator');
const adminVerificator = require('../utils/adminVerificator');

const router = Router();

router.get('/', controller.getAllCategories);
router.get('/:categoryId', controller.getCategoryById);
router.get('/:categoryId/posts', controller.getPostsByCategory);
router.post('/', authVerificator, adminVerificator, controller.createCategory);
router.patch('/:categoryId', authVerificator, adminVerificator, controller.changeCategories);
router.delete('/:categoryId', authVerificator, adminVerificator, controller.deleteCategories);

module.exports = router;