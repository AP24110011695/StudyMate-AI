const Router = require('express').Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;
