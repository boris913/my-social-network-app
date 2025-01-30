const { Comment, Tweet, User } = require('../models');

// Fonction récursive pour récupérer les réponses imbriquées
const fetchReplies = async (comment) => {
  const replies = await Comment.findAll({
    where: { parentCommentId: comment.id },
    include: [
      { model: User, attributes: ['id', 'username', 'profile_picture'] },
      { model: Comment, as: 'ParentComment', include: [{ model: User, attributes: ['id', 'username'] }] }
    ]
  });

  for (let reply of replies) {
    reply.dataValues.replies = await fetchReplies(reply); // Récursion pour récupérer les réponses imbriquées
  }

  return replies;
};


const commentController = {
  createComment: async (req, res) => {
    try {
      const { content, tweetId } = req.body;
      const userId = req.user.id;

      const comment = await Comment.create({
        userId: userId,
        tweetId: tweetId,
        content
      });

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
      const comments = await Comment.findAll({
        where: { tweetId: tweetId, parentCommentId: null },
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] }
        ]
      });

      for (let comment of comments) {
        comment.dataValues.replies = await fetchReplies(comment); // Récupérer les réponses imbriquées pour chaque commentaire
      }

      res.status(200).json(comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
      res.status(500).json({ message: err.message });
    }
  },

  getRepliesByComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const replies = await Comment.findAll({
        where: { parentCommentId: commentId },
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] },
          { model: Comment, as: 'ParentComment', include: [{ model: User, attributes: ['id', 'username'] }] }
        ]
      });

      for (let reply of replies) {
        reply.dataValues.replies = await fetchReplies(reply); // Récupérer les réponses imbriquées pour chaque réponse
      }

      res.status(200).json(replies);
    } catch (err) {
      console.error('Error fetching replies:', err);
      res.status(500).json({ message: err.message });
    }
  },

  getCommentsByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const comments = await Comment.findAll({
        where: { userId: userId },
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] },
          { model: Tweet, attributes: ['id', 'content'] },
          { model: Comment, as: 'ParentComment', include: [{ model: User, attributes: ['id', 'username'] }] }
        ]
      });

      res.status(200).json(comments);
    } catch (err) {
      console.error('Error fetching comments by user:', err);
      res.status(500).json({ message: err.message });
    }
  },







  replyToComment: async (req, res) => {
    try {
      const { content, parentCommentId } = req.body;
      const userId = req.user.id;

      const parentComment = await Comment.findByPk(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }

      const reply = await Comment.create({
        userId: userId,
        tweetId: parentComment.tweetId,
        parentCommentId: parentCommentId,
        content
      });

      await reply.reload({
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] },
          { model: Comment, as: 'ParentComment', include: [{ model: User, attributes: ['id', 'username', 'profile_picture'] }] }
        ]
      });

      res.status(201).json(reply);
    } catch (err) {
      res.status(400).json({ message: err.message });
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





