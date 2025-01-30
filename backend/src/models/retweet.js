const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Retweet = sequelize.define('Retweet', {
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
      allowNull: true,
      references: {
        model: 'Tweets',
        key: 'id'
      }
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
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

  Retweet.associate = function(models) {
    Retweet.belongsTo(models.User, { foreignKey: 'userId' });
    Retweet.belongsTo(models.Tweet, { foreignKey: 'tweetId' });
    Retweet.belongsTo(models.Comment, { foreignKey: 'commentId' });
  };

  return Retweet;
};