// src/routes/share.js
const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, shareController.createShare);
router.delete('/:id', authenticate, shareController.deleteShare);
router.get('/tweet/:tweetId', shareController.getSharesByTweet);

module.exports = router;