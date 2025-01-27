const { Tweet, User } = require('../models');
const { Op } = require('sequelize');

const searchController = {
  search: async (req, res) => {
    try {
      const { query, type } = req.query;
      let results;

      switch (type) {
        case 'tweet':
          results = await Tweet.findAll({
            where: {
              content: {
                [Op.like]: `%${query}%`
              }
            },
            include: [{ model: User, attributes: ['id', 'username', 'profile_picture'] }]
          });
          break;
        case 'user':
          results = await User.findAll({
            where: {
              username: {
                [Op.like]: `%${query}%`
              }
            },
            attributes: ['id', 'username', 'profile_picture']
          });
          break;
        default:
          return res.status(400).json({ message: 'Invalid search type' });
      }

      res.status(200).json(results);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

module.exports = searchController;