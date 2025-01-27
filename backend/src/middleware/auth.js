const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token received:', token);

  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId }; // Assurez-vous que l'ID de l'utilisateur est correctement ajouté
    console.log('Token decoded:', decoded);
    next();
  } catch (error) {
    console.error('Token verification error:', error);

    let errorMessage = 'Invalid token';
    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token expired';
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Token malformed';
    }

    res.status(400).json({ error: errorMessage });
  }
};

module.exports = { authenticate };