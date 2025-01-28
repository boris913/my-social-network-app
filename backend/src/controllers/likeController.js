const { Like, Tweet, User, Comment, Sequelize } = require('../models'); //
const Op = Sequelize.Op; 

const likeController = {
  createLike: async (req, res) => {
    try {
      const { tweetId } = req.body;
      const userId = req.user.id; // Assuming you have middleware to extract the user ID from the request

      // Check if the user has already liked the tweet
      const existingLike = await Like.findOne({
        where: { userId: userId, tweetId: tweetId }
      });

      if (existingLike) {
        return res.status(400).json({ message: 'You have already liked this tweet' });
      }

      const like = await Like.create({
        userId: userId,
        tweetId: tweetId
      });

      // Optionally, you can include the user information in the response
      await like.reload({
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] },
          { model: Tweet, attributes: ['id'] }
        ]
      });

      res.status(201).json(like);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteLike: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const like = await Like.findOne({
        where: { id, userId: userId }
      });

      if (!like) {
        return res.status(404).json({ message: 'Like not found' });
      }

      await like.destroy();

      res.status(204).json();
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getLikesByTweet: async (req, res) => {
    try {
      const { tweetId } = req.params;
      const likes = await Like.findAll({
        where: { tweetId: tweetId },
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] }
        ]
      });

      res.status(200).json(likes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

   // Fonction pour récupérer les tweets likés par un utilisateur
getLikedTweetsByUser: async (req, res) => {
  try {
    const userId = req.params.userId;

    // Récupérer les likes de l'utilisateur avec les tweets associés
    const likes = await Like.findAll({
      where: { userId: userId },
      include: [{
        model: Tweet,
        include: [User] // Inclure les informations de l'utilisateur qui a créé le tweet
      }]
    });

    // Extraire uniquement les tweets likés
    const likedTweets = likes.map(like => like.Tweet);

    res.status(200).json(likedTweets);
  } catch (error) {
    console.error('Erreur lors de la récupération des tweets likés:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des tweets likés' });
  }
},

//-----------------------------------------------Gestions des Likes pour les commentaires------------------------------------------------ 

createLikeForComment: async (req, res) => {
  try {
    const { commentId } = req.body;
    const userId = req.user.id;

    // Vérifier si l'utilisateur a déjà liké le commentaire
    const existingLike = await Like.findOne({
      where: { userId: userId, commentId: commentId }
    });

    if (existingLike) {
      return res.status(400).json({ message: 'Vous avez déjà liké ce commentaire' });
    }

    const like = await Like.create({
      userId: userId,
      commentId: commentId
    });

    // Optionnellement, inclure les informations de l'utilisateur et du commentaire dans la réponse
    await like.reload({
      include: [
        { model: User, attributes: ['id', 'username', 'profile_picture'] },
        { model: Comment, attributes: ['id', 'content'] }
      ]
    });

    res.status(201).json(like);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
},

deleteLikeForComment: async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const like = await Like.findOne({
      where: { id, userId: userId, commentId: { [Op.ne]: null } }
    });

    if (!like) {
      return res.status(404).json({ message: 'Like non trouvé' });
    }

    await like.destroy();

    res.status(204).json();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
},

getLikesByComment: async (req, res) => {
  try {
    const { commentId } = req.params;
    const likes = await Like.findAll({
      where: { commentId: commentId },
      include: [
        { model: User, attributes: ['id', 'username', 'profile_picture'] }
      ]
    });

    res.status(200).json(likes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},


};

module.exports = likeController;