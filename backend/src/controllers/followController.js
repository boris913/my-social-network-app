const { Follow, User } = require('../models');

const followController = {
  createFollow: async (req, res) => {
    try {
      const { followingId } = req.body;
      const followerId = req.user.id; // Assuming you have middleware to extract the user ID from the request

      // Check if the user is already following the target user
      const existingFollow = await Follow.findOne({
        where: { followerId: followerId, followingId: followingId }
      });

      if (existingFollow) {
        return res.status(400).json({ message: 'You are already following this user' });
      }

      const follow = await Follow.create({
        followerId: followerId,
        followingId: followingId
      });

      // Optionally, you can include the follower and followed user information in the response
      await follow.reload({
        include: [
          { model: User, as: 'follower', attributes: ['id', 'username', 'profile_picture'] },
          { model: User, as: 'following', attributes: ['id', 'username', 'profile_picture'] }
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
        where: { id, followerId: followerId }
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
      const { userId } = req.params;
      const follows = await Follow.findAll({
        where: { followerId: userId },
        include: [
          { model: User, as: 'following', attributes: ['id', 'username', 'profile_picture'] }
        ]
      });

      res.status(200).json(follows);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getFollowers: async (req, res) => {
    try {
      const { userId } = req.params;
      const followers = await Follow.findAll({
        where: { followingId: userId },
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