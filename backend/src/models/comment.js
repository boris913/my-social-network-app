const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    tweetId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tweets',
        key: 'id'
      }
    },
    parentCommentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Comments',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: true
  });

  Comment.associate = function(models) {
    Comment.belongsTo(models.User, { foreignKey: 'userId' });
    Comment.belongsTo(models.Tweet, { foreignKey: 'tweetId' });
    Comment.belongsTo(models.Comment, { foreignKey: 'parentCommentId', as: 'ParentComment' });
    Comment.hasMany(models.Comment, { foreignKey: 'parentCommentId', as: 'Replies' });
    Comment.hasMany(models.Like, { foreignKey: 'commentId' });
  };

  return Comment;
};