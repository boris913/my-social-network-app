const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const PrivateMessage = sequelize.define('PrivateMessage', {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    receiverId: {
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

  PrivateMessage.associate = function(models) {
    PrivateMessage.belongsTo(models.User, { foreignKey: 'senderId', as: 'Sender' });
    PrivateMessage.belongsTo(models.User, { foreignKey: 'receiverId', as: 'Receiver' });
  };

  return PrivateMessage;
};
