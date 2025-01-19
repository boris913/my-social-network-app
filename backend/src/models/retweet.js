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
      allowNull: false,
      references: {
        model: 'Tweets',
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
  };

  return Retweet;
};
