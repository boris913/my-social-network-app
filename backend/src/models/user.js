const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_picture: {
      type: DataTypes.STRING
    },
    bio: {
      type: DataTypes.TEXT
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

  User.associate = function(models) {
    User.hasMany(models.Tweet, { foreignKey: 'userId' });
    User.hasMany(models.Comment, { foreignKey: 'userId' });
    User.hasMany(models.Like, { foreignKey: 'userId' });
    User.hasMany(models.Retweet, { foreignKey: 'userId' });
    User.hasMany(models.Share, { foreignKey: 'userId' });
    User.hasMany(models.PrivateMessage, { foreignKey: 'senderId', as: 'SentMessages' });
    User.hasMany(models.PrivateMessage, { foreignKey: 'receiverId', as: 'ReceivedMessages' });
    User.hasMany(models.Notification, { foreignKey: 'userId' });
    User.belongsToMany(User, { through: 'Follows', as: 'Followers', foreignKey: 'followingId' });
    User.belongsToMany(User, { through: 'Follows', as: 'Following', foreignKey: 'followerId' });
  };

  return User;
};
