// src/routes/tweet.js
const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, tweetController.createTweet);
router.get('/', tweetController.getAllTweets);
router.get('/:id', tweetController.getTweet);
router.put('/:id', authenticate, tweetController.updateTweet);
router.delete('/:id', authenticate, tweetController.deleteTweet);
router.get('/user/:userId', tweetController.getTweetsByUser);
router.get('/search', tweetController.search);
router.get('/feed', authenticate, tweetController.getFeed);

module.exports = router;