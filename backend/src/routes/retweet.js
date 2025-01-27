// src/routes/retweet.js
const express = require('express');
const router = express.Router();
const retweetController = require('../controllers/retweetController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, retweetController.createRetweet);
router.delete('/:id', authenticate, retweetController.deleteRetweet);
router.get('/tweet/:tweetId', retweetController.getRetweetsByTweet);

// Nouvelle route pour récupérer les retweets d'un utilisateur
router.get('/user/:userId', authenticate, retweetController.getRetweetsByUser);

module.exports = router;