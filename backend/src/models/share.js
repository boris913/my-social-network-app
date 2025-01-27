const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Share = sequelize.define('Share', {
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
    platform: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: true
  });

  Share.associate = function(models) {
    Share.belongsTo(models.User, { foreignKey: 'userId' });
    Share.belongsTo(models.Tweet, { foreignKey: 'tweetId' });
  };

  return Share;
};