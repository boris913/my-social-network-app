const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
  register: async (req, res) => {
    try {
      const { username, email, password, profile_picture, bio } = req.body;

      // Check if the email or username is already taken
      const existingUser = await User.findOne({
        where: { [Op.or]: [{ email }, { username }] }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email or username already taken' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        profile_picture,
        bio
      });

      // Generate a JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      res.status(201).json({ user, token });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.json({ user, token });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: ['id', 'username', 'email', 'profile_picture']
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'profile_picture'],
        limit: 5 // Limiter à 5 utilisateurs
      });
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateUser: async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, profile_picture, bio } = req.body;
    const userId = req.user.id; // Assuming you have middleware to extract the user ID from the request

    if (id !== userId.toString()) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username;
    user.email = email;
    user.profile_picture = profile_picture;
    user.bio = bio;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
};

module.exports = userController;