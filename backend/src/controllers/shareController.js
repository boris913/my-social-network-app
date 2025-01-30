const { Share, Comment, Tweet, User } = require('../models');

const shareController = {
  createShare: async (req, res) => {
    try {
      const { tweetId, platform } = req.body;
      const userId = req.user.id; // Assuming you have middleware to extract the user ID from the request

      if (!tweetId || !platform) {
        return res.status(400).json({ message: 'Tweet ID and platform are required' });
      }

      // Check if the user has already shared the tweet on the same platform
      const existingShare = await Share.findOne({
        where: { userId: userId, tweetId: tweetId, platform }
      });

      if (existingShare) {
        return res.status(400).json({ message: 'You have already shared this tweet on this platform' });
      }

      const share = await Share.create({
        userId: userId,
        tweetId: tweetId,
        platform
      });

      // Optionally, you can include the user, tweet, and platform information in the response
      await share.reload({
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] },
          { model: Tweet, attributes: ['id', 'content', 'imageUrl', 'videoUrl'] }
        ]
      });

      res.status(201).json(share);
    } catch (err) {
      console.error('Error in createShare:', err);
      res.status(400).json({ message: err.message });
    }
  },

  deleteShare: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      console.log(`Trying to delete share with ID: ${id} for user ID: ${userId}`);

      const share = await Share.findOne({
        where: { id, userId: userId }
      });

      if (!share) {
        console.log('Share not found');
        return res.status(404).json({ message: 'Share not found' });
      }

      await share.destroy();

      console.log('Share deleted successfully');
      res.status(204).json();
    } catch (err) {
      console.error('Error deleting share:', err);
      res.status(400).json({ message: err.message });
    }
  },

  getSharesByTweet: async (req, res) => {
    try {
      const { tweetId } = req.params;
      const shares = await Share.findAll({
        where: { tweetId: tweetId },
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] },
          { model: Tweet, attributes: ['id', 'content', 'imageUrl', 'videoUrl'] }
        ]
      });

      res.status(200).json(shares);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

 //-----------------------------------------------methodes pour les comments-----------------------------------------------

 createShareComment: async (req, res) => {
  try {
    const { commentId, platform } = req.body;
    const userId = req.user.id; // Assuming you have middleware to extract the user ID from the request

    if (!commentId || !platform) {
      return res.status(400).json({ message: 'Comment ID and platform are required' });
    }

    // Check if the user has already shared the comment on the same platform
    const existingShare = await Share.findOne({
      where: { userId: userId, commentId: commentId, platform }
    });

    if (existingShare) {
      return res.status(400).json({ message: 'You have already shared this comment on this platform' });
    }

    const share = await Share.create({
      userId: userId,
      commentId: commentId,
      platform
    });

    // Optionally, you can include the user and comment information in the response
    await share.reload({
      include: [
        { model: User, attributes: ['id', 'username', 'profile_picture'] },
        { model: Comment, attributes: ['id', 'content'] }
      ]
    });

    res.status(201).json(share);
  } catch (err) {
    console.error('Error in createShareComment:', err);
    res.status(400).json({ message: err.message });
  }
},

deleteShareComment: async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log(`Trying to delete share with ID: ${id} for user ID: ${userId}`);

    const share = await Share.findOne({
      where: { id, userId: userId, commentId: { [Sequelize.Op.ne]: null } }
    });

    if (!share) {
      console.log('Share not found');
      return res.status(404).json({ message: 'Share not found' });
    }

    await share.destroy();

    console.log('Share deleted successfully');
    res.status(204).json();
  } catch (err) {
    console.error('Error deleting share:', err);
    res.status(400).json({ message: err.message });
  }
},

getSharesByComment: async (req, res) => {
  try {
    const { commentId } = req.params;
    const shares = await Share.findAll({
      where: { commentId: commentId },
      include: [
        { model: User, attributes: ['id', 'username', 'profile_picture'] },
        { model: Comment, attributes: ['id', 'content'] }
      ]
    });

    res.status(200).json(shares);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},
};

module.exports = shareController;