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
    Share.belongsTo(models.Comment, { foreignKey: 'commentId' });
  };

  return Share;
};