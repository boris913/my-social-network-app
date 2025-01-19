const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
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

  Follow.associate = function(models) {
    Follow.belongsTo(models.User, { foreignKey: 'followerId' });
    Follow.belongsTo(models.User, { foreignKey: 'followingId' });
  };

  return Follow;
};
