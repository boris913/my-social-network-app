const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/suggestions', userController.getAllUsers); // Déplacer cette ligne avant la route /:id
router.get('/:id', userController.getUser);
router.put('/:id', authenticate, userController.updateUser);

module.exports = router;