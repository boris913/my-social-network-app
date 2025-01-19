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
const authRoutes = require('./src/routes/auth');
// const tweetRoutes = require('./routes/tweet'); // Uncomment this line if you have tweetRoutes defined

// Use routes
app.use('/api/auth', authRoutes);
// app.use('/api/tweets', tweetRoutes); // Uncomment this line if you have tweetRoutes defined

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await db.sequelize.authenticate();
  await db.sequelize.sync({ force: false }); // Synchronisez les modèles avec la base de données

  // Import chalk dynamically
  const chalk = await import('chalk');
  console.log(chalk.default.magenta('Database connected!')); // Colorer le message en magenta
});