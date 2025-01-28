// src/routes/comment.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, commentController.createComment);
router.get('/:tweetId', commentController.getCommentsByTweet);
router.put('/:id', authenticate, commentController.updateComment);
router.delete('/:id', authenticate, commentController.deleteComment);

router.post('/reply', authenticate, commentController.replyToComment);

module.exports = router;