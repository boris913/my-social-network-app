// src/routes/notification.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, notificationController.createNotification);
router.get('/', authenticate, notificationController.getNotifications);
router.put('/:id', authenticate, notificationController.updateNotification);

module.exports = router;