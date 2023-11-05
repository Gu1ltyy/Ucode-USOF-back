const { Router } = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/auth-controller');

const router = Router();

router.post('/register', 
    [
        body('email').isEmail(),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters.')
    ], 
    controller.registration
);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/activate/:link/:id', controller.activate);
router.post('/password-reset', controller.resetSendLink);
router.post('/password-reset/:resetToken',
    [
        body('newPassword').isLength({ min: 5 }).withMessage('Password must be at least 5 characters.')
    ], 
    controller.resetPasswordWithToken
);
router.get('/refresh', controller.refresh);

module.exports = router;