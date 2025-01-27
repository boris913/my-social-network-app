const { PrivateMessage, User } = require('../models');

const privateMessageController = {
  sendMessage: async (req, res) => {
    try {
      const { recipientId, content } = req.body;
      const senderId = req.user.id; // Assuming you have middleware to extract the user ID from the request

      const message = await PrivateMessage.create({
        sender_id: senderId,
        recipient_id: recipientId,
        content,
        is_read: false
      });

      // Optionally, you can include the sender and recipient information in the response
      await message.reload({
        include: [
          { model: User, as: 'sender', attributes: ['id', 'username', 'profile_picture'] },
          { model: User, as: 'recipient', attributes: ['id', 'username', 'profile_picture'] }
        ]
      });

      res.status(201).json(message);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getMessages: async (req, res) => {
    try {
      const userId = req.user.id;
      const messages = await PrivateMessage.findAll({
        where: {
          [Op.or]: [
            { sender_id: userId },
            { recipient_id: userId }
          ]
        },
        include: [
          { model: User, as: 'sender', attributes: ['id', 'username', 'profile_picture'] },
          { model: User, as: 'recipient', attributes: ['id', 'username', 'profile_picture'] }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateMessage: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const message = await PrivateMessage.findOne({
        where: { id, recipient_id: userId }
      });

      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      message.is_read = true;
      await message.save();

      res.status(200).json(message);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

module.exports = privateMessageController;