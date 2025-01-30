// src/routes/share.js
const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, shareController.createShare);
router.post('/comment', authenticate, shareController.createShareComment);
router.delete('/:id', authenticate, shareController.deleteShare);
router.delete('/comment/:id', authenticate, shareController.deleteShareComment);
router.get('/tweet/:tweetId', shareController.getSharesByTweet);
router.get('/comment/:commentId', shareController.getSharesByComment);

module.exports = router;