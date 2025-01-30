// src/routes/follow.js
const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, followController.createFollow);
router.delete('/:id', authenticate, followController.deleteFollow);
router.get('/follows/:userId', authenticate, followController.getFollows);
router.get('/followers/:userId', authenticate, followController.getFollowers);

module.exports = router;