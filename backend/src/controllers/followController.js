const { Follow, User } = require('../models');

const followController = {
  createFollow: async (req, res) => {
    try {
      const { followedId } = req.body;
      const followerId = req.user.id; // Assuming you have middleware to extract the user ID from the request

      // Check if the user is already following the target user
      const existingFollow = await Follow.findOne({
        where: { follower_id: followerId, followed_id: followedId }
      });

      if (existingFollow) {
        return res.status(400).json({ message: 'You are already following this user' });
      }

      const follow = await Follow.create({
        follower_id: followerId,
        followed_id: followedId
      });

      // Optionally, you can include the follower and followed user information in the response
      await follow.reload({
        include: [
          { model: User, as: 'follower', attributes: ['id', 'username', 'profile_picture'] },
          { model: User, as: 'followed', attributes: ['id', 'username', 'profile_picture'] }
        ]
      });

      res.status(201).json(follow);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteFollow: async (req, res) => {
    try {
      const { id } = req.params;
      const followerId = req.user.id;

      const follow = await Follow.findOne({
        where: { id, follower_id: followerId }
      });

      if (!follow) {
        return res.status(404).json({ message: 'Follow not found' });
      }

      await follow.destroy();

      res.status(204).json();
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getFollows: async (req, res) => {
    try {
      const userId = req.user.id;
      const follows = await Follow.findAll({
        where: { follower_id: userId },
        include: [
          { model: User, as: 'followed', attributes: ['id', 'username', 'profile_picture'] }
        ]
      });

      res.status(200).json(follows);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getFollowers: async (req, res) => {
    try {
      const userId = req.user.id;
      const followers = await Follow.findAll({
        where: { followed_id: userId },
        include: [
          { model: User, as: 'follower', attributes: ['id', 'username', 'profile_picture'] }
        ]
      });

      res.status(200).json(followers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = followController;