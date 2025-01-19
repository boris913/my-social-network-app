const crypto = require('crypto');

// Générer une clé secrète de 32 octets
const secret = crypto.randomBytes(32).toString('hex');
console.log(secret); // Affiche une clé secrète aléatoire