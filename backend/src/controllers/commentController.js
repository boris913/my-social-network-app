const { Comment, Tweet, User } = require('../models');

const commentController = {
  createComment: async (req, res) => {
    try {
      const { content, tweetId } = req.body;
      const userId = req.user.id; // Assuming you have middleware to extract the user ID from the request

      const comment = await Comment.create({
        userId: userId,
        tweetId: tweetId,
        content
      });

      // Optionally, you can include the user information in the response
      await comment.reload({
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] },
          { model: Tweet, attributes: ['id'] }
        ]
      });

      res.status(201).json(comment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getCommentsByTweet: async (req, res) => {
    try {
      const { tweetId } = req.params;
      console.log('Fetching comments for tweetId:', tweetId); // Log tweetId
      const comments = await Comment.findAll({
        where: { tweetId: tweetId },
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] }
        ]
      });
      console.log('Comments retrieved:', comments); // Log comments
      res.status(200).json(comments);
    } catch (err) {
      console.error('Error fetching comments:', err); // Log error
      res.status(500).json({ message: err.message });
    }
  },

  updateComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      const comment = await Comment.findOne({
        where: { id, userId: userId }
      });

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      comment.content = content;
      await comment.save();

      res.status(200).json(comment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const comment = await Comment.findOne({
        where: { id, userId: userId }
      });

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      await comment.destroy();

      res.status(204).json();
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

module.exports = commentController;