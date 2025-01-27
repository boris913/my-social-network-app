// src/routes/privateMessage.js
const express = require('express');
const router = express.Router();
const privateMessageController = require('../controllers/privateMessageController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, privateMessageController.sendMessage);
router.get('/', authenticate, privateMessageController.getMessages);
router.put('/:id', authenticate, privateMessageController.updateMessage);

module.exports = router;