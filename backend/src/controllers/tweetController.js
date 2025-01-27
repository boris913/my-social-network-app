const { Tweet, User, Comment  } = require('../models');

const tweetController = {
  createTweet: async (req, res) => {
    try {
      console.log('Entering createTweet function');
      const { content, imageUrl, videoUrl } = req.body;
      console.log('Request body:', { content, imageUrl, videoUrl });

      const userId = req.user.id;
      console.log('User ID extracted:', userId);

      if (!userId) {
        throw new Error('User ID is missing');
      }

      const tweet = await Tweet.create({
        content,
        imageUrl, // Utilisation des noms de champs fournis
        videoUrl, // Utilisation des noms de champs fournis
        userId // Utilisation des noms de champs fournis
      });

      console.log('Tweet created:', tweet);

      await tweet.reload({
        include: [{ model: User, attributes: ['id', 'username', 'profile_picture'] }]
      });
      console.log('Tweet with user data:', tweet);

      res.status(201).json(tweet);
    } catch (err) {
      console.error('Error in createTweet function:', err);
      res.status(400).json({ message: "Erreur pour la creation d'un tweet" });
    }
  },

  getTweet: async (req, res) => {
    try {
      const { id } = req.params;
      const tweet = await Tweet.findByPk(id, {
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] },
          {
            model: Comment,
            include: [{ model: User, attributes: ['id', 'username', 'profile_picture'] }]
          }
        ]
      });

      if (!tweet) {
        return res.status(404).json({ message: 'Tweet not found' });
      }

      res.status(200).json(tweet);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateTweet: async (req, res) => {
    try {
      const { id } = req.params;
      const { content, imageUrl, videoUrl } = req.body;
      const userId = req.user.id;

      const tweet = await Tweet.findOne({
        where: { id, userId: userId },
        include: [{ model: User, attributes: ['id', 'username', 'profile_picture'] }]
      });

      if (!tweet) {
        return res.status(404).json({ message: 'Tweet not found' });
      }

      tweet.content = content;
      tweet.imageUrl = imageUrl;
      tweet.videoUrl = videoUrl;
      await tweet.save();

      await tweet.reload({
        include: [{ model: User, attributes: ['id', 'username', 'profile_picture'] }]
      });

      res.status(200).json(tweet);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },


  deleteTweet: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      console.log(`Tentative de suppression du tweet avec ID : ${id} par l'utilisateur avec ID : ${userId}`);

      const tweet = await Tweet.findOne({
        where: { id, userId }
      });

      if (!tweet) {
        console.log('Tweet non trouvé');
        return res.status(404).json({ message: 'Tweet not found' });
      }

      await tweet.destroy();

      console.log('Tweet supprimé avec succès');
      res.status(204).json();
    } catch (error) {
      console.error('Erreur lors de la suppression du tweet:', error);
      res.status(500).json({ message: 'Erreur pour supprimer le tweet' });
    }
  },

  // Autres méthodes...

  getTweetsByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const tweets = await Tweet.findAll({
        where: { userId: userId },
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json(tweets);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  search: async (req, res) => {
    try {
      const { query, type } = req.query;
      let results;

      switch (type) {
        case 'tweet':
          results = await Tweet.findAll({
            where: {
              content: {
                [Op.like]: `%${query}%`
              }
            },
            include: [{ model: User, attributes: ['id', 'username'] }]
          });
          break;
        case 'user':
          results = await User.findAll({
            where: {
              username: {
                [Op.like]: `%${query}%`
              }
            },
            attributes: ['id', 'username']
          });
          break;
        // Ajoutez d'autres types de recherche (hashtag, etc.)
        default:
          return res.status(400).json({ message: 'Invalid search type' });
      }

      res.status(200).json(results);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getFeed: async (req, res) => {
    try {
      const userId = req.user.userId;

      const feed = await Tweet.findAll({
        where: {
          userId: {
            [Op.in]: sequelize.literal(`(
              SELECT "followingId"
              FROM "Follows"
              WHERE "followerId" = ${userId}
            )`)
          }
        },
        include: [{ model: User, attributes: ['id', 'username'] }],
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json(feed);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getAllTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] },
          {
            model: Comment,
            include: [{ model: User, attributes: ['id', 'username', 'profile_picture'] }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
  
      res.status(200).json(tweets);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

 
};

module.exports = tweetController;