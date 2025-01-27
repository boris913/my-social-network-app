const express = require('express');
const app = express();

// Importer les routes
const tweetRoutes = require('./routes/tweet');
const commentRoutes = require('./routes/comment');
const likeRoutes = require('./routes/like');
const retweetRoutes = require('./routes/retweet');
const shareRoutes = require('./routes/share');
const notificationRoutes = require('./routes/notification');
const privateMessageRoutes = require('./routes/privateMessage');
const followRoutes = require('./routes/follow');

app.use(express.json());

// Utiliser les routes
app.use('/tweets', tweetRoutes);
app.use('/comments', commentRoutes);
app.use('/likes', likeRoutes);
app.use('/retweets', retweetRoutes);
app.use('/shares', shareRoutes);
app.use('/notifications', notificationRoutes);
app.use('/messages', privateMessageRoutes);
app.use('/follows', followRoutes);

module.exports = app;