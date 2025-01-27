const { Retweet, Tweet, User } = require('../models');

const retweetController = {
  createRetweet: async (req, res) => {
    try {
      const { tweetId } = req.body;
      const userId = req.user.id; // Assuming you have middleware to extract the user ID from the request

      // Check if the user has already retweeted the tweet
      const existingRetweet = await Retweet.findOne({
        where: { userId: userId, tweetId: tweetId }
      });

      if (existingRetweet) {
        return res.status(400).json({ message: 'You have already retweeted this tweet' });
      }

      const retweet = await Retweet.create({
        userId: userId,
        tweetId: tweetId
      });

      // Optionally, you can include the user and tweet information in the response
      await retweet.reload({
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] },
          { model: Tweet, attributes: ['id', 'content', 'imageUrl', 'videoUrl'] }
        ]
      });

      res.status(201).json(retweet);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteRetweet: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const retweet = await Retweet.findOne({
        where: { id, userId: userId }
      });

      if (!retweet) {
        return res.status(404).json({ message: 'Retweet not found' });
      }

      await retweet.destroy();

      res.status(204).json();
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getRetweetsByTweet: async (req, res) => {
    try {
      const { tweetId } = req.params;
      const retweets = await Retweet.findAll({
        where: { tweetId: tweetId },
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] }
        ]
      });

      res.status(200).json(retweets);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

   // Nouvelle fonction pour récupérer les retweets d'un utilisateur
   getRetweetsByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const retweets = await Retweet.findAll({
        where: { userId: userId },
        include: [
          { model: Tweet, include: [User] }
        ]
      });

      res.status(200).json(retweets.map(retweet => retweet.Tweet));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = retweetController;