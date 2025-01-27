require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/models'); // Importer les modèles
const path = require('path'); // Importer le module path

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS to allow requests from your frontend domain
app.use(cors({
  origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend en production
  credentials: true
}));

app.use(bodyParser.json());

// Configurer le middleware pour servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Hello World');
  });

// Import routes
const userRoutes = require('./src/routes/user');
const authRoutes = require('./src/routes/auth');
const tweetRoutes = require('./src/routes/tweet');
const commentRoutes = require('./src/routes/comment');
const likeRoutes = require('./src/routes/like');
const retweetRoutes = require('./src/routes/retweet');
const shareRoutes = require('./src/routes/share');
const notificationRoutes = require('./src/routes/notification');
const privateMessageRoutes = require('./src/routes/privateMessage');
const followRoutes = require('./src/routes/follow');
const searchRoutes = require('./src/routes/search'); // Importer les routes de recherche

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/retweets', retweetRoutes);
app.use('/api/shares', shareRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', privateMessageRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/search', searchRoutes); // Utiliser les routes de recherche

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await db.sequelize.authenticate();
  await db.sequelize.sync({ force: false }); // Synchronisez les modèles avec la base de données

  // Import chalk dynamically
  const chalk = await import('chalk');
  console.log(chalk.default.magenta('Database connected!')); // Colorer le message en magenta
});