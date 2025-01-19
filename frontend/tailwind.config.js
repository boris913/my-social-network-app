// tailwind.config.js
module.exports = {
  darkMode: 'class', // Utiliser 'class' pour activer le mode sombre en ajoutant une classe
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'dark-bg': '#1a202c', // Couleur de fond pour le mode sombre
        'light-bg': '#ffffff', // Couleur de fond pour le mode clair
      },
      textColor: {
        'dark-text': '#cbd5e0', // Couleur de texte pour le mode sombre
        'light-text': '#2d3748', // Couleur de texte pour le mode clair
      },
      margin: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        // Ajoutez d'autres valeurs si nécessaire
      },
    },
  },
  plugins: [],
}