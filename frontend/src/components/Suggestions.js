import React from 'react';
import suggestionsData from '../data/suggestions.json'; // Assurez-vous que le chemin est correct
import VerifiedBadge from './VerifiedBadge'; // Importer le composant

function Suggestions() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-4 border border-gray-400 dark:border-gray-1000">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Who to follow</h2>
      {/* Liste des suggestions */}
      <div className="space-y-2">
        {suggestionsData.map(suggestion => (
          <div key={suggestion.id} className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
            <img src={suggestion.profileImage} alt="Profile" className="rounded-full h-10 w-10 mr-2" />
            <div>
              <p className="text-gray-900 dark:text-white font-bold">
                {suggestion.name}
                {suggestion.isVerified && <VerifiedBadge />} {/* Afficher le badge si l'utilisateur est vérifié */}
              </p>
              <p className="text-gray-500 dark:text-gray-400">@{suggestion.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Suggestions;