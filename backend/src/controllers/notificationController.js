const { Notification, User } = require('../models');

const notificationController = {
  createNotification: async (req, res) => {
    try {
      const { type, targetId } = req.body;
      const userId = req.user.id; // Assuming you have middleware to extract the user ID from the request

      const notification = await Notification.create({
        user_id: userId,
        type,
        target_id: targetId,
        is_read: false
      });

      // Optionally, you can include the user information in the response
      await notification.reload({
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] }
        ]
      });

      res.status(201).json(notification);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getNotifications: async (req, res) => {
    try {
      const userId = req.user.id;
      const notifications = await Notification.findAll({
        where: { user_id: userId },
        include: [
          { model: User, attributes: ['id', 'username', 'profile_picture'] }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json(notifications);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await Notification.findOne({
        where: { id, user_id: userId }
      });

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      notification.is_read = true;
      await notification.save();

      res.status(200).json(notification);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

module.exports = notificationController;