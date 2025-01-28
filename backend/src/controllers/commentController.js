const { Comment, Tweet, User } = require('../models');

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
          { model: User, attributes: ['id', 'username', 'profile_picture'] },
          {
            model: Comment,
            as: 'Replies',
            include: [
              { model: User, attributes: ['id', 'username', 'profile_picture'] },
              {
                model: Comment,
                as: 'Replies',
                include: [
                  { model: User, attributes: ['id', 'username', 'profile_picture'] },
                  {
                    model: Comment,
                    as: 'Replies',
                    include: [{ model: User, attributes: ['id', 'username', 'profile_picture'] }]
                  }
                ]
              }
            ]
          }
        ]
      });

      const commentsWithReplies = comments.map(comment => ({
        ...comment.toJSON(),
        replies: comment.Replies ? comment.Replies.map(reply => reply.toJSON()) : []
      }));

      res.status(200).json(commentsWithReplies);
    } catch (err) {
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
  }

};

module.exports = commentController;





