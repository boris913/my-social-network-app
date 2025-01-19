const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController');
const auth = require('../middleware/auth');

// Poster un tweet
router.post('/', auth, tweetController.createTweet);

// Récupérer les tweets
router.get('/', tweetController.getTweets);

module.exports = router;