const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
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
    imageUrl: {
      type: DataTypes.STRING
    },
    videoUrl: {
      type: DataTypes.STRING
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

  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User, { foreignKey: 'userId' });
    Tweet.hasMany(models.Comment, { foreignKey: 'tweetId' });
    Tweet.hasMany(models.Like, { foreignKey: 'tweetId' });
    Tweet.hasMany(models.Retweet, { foreignKey: 'tweetId' });
    Tweet.hasMany(models.Share, { foreignKey: 'tweetId' });
  };

  return Tweet;
};
