// src/routes/like.js
const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, likeController.createLike);
router.delete('/:id', authenticate, likeController.deleteLike);
router.get('/tweet/:tweetId', likeController.getLikesByTweet);
// Nouvelle route pour récupérer les tweets likés par un utilisateur
router.get('/user/:userId', authenticate, likeController.getLikedTweetsByUser);

module.exports = router;