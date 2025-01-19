const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    tweetId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tweets',
        key: 'id'
      }
    },
    commentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Comments',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: true
  });

  Like.associate = function(models) {
    Like.belongsTo(models.User, { foreignKey: 'userId' });
    Like.belongsTo(models.Tweet, { foreignKey: 'tweetId' });
    Like.belongsTo(models.Comment, { foreignKey: 'commentId' });
  };

  return Like;
};
