import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import VerifiedBadge from './VerifiedBadge'; // Importer le composant

function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/suggestions', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assurez-vous que l'utilisateur est authentifié
          },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions:', error);
      }
    };

    fetchSuggestions();
  }, []);

  // Base URL du serveur backend
  const BASE_URL = 'http://localhost:5000';

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-4 border border-gray-400 dark:border-gray-1000">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Who to follow</h2>
      {/* Liste des suggestions */}
      <div className="space-y-2">
        {suggestions.map(suggestion => {
          // Construction de l'URL complète pour la photo de profil
          const profilePictureUrl = suggestion.profile_picture.startsWith('/uploads/')
            ? `${BASE_URL}${suggestion.profile_picture}`
            : suggestion.profile_picture;

          return (
            <Link to={`/profile/${suggestion.id}`} key={suggestion.id} className="block">
              <div className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                <img src={profilePictureUrl} alt="Profile" className="rounded-full h-10 w-10 mr-2" />
                <div>
                  <p className="text-gray-900 dark:text-white font-bold">
                    {suggestion.username}
                    {suggestion.isVerified && <VerifiedBadge />} {/* Afficher le badge si l'utilisateur est vérifié */}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">@{suggestion.username}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Suggestions;


// import React from 'react';
// import suggestionsData from '../data/suggestions.json'; // Assurez-vous que le chemin est correct
// import VerifiedBadge from './VerifiedBadge'; // Importer le composant

// function Suggestions() {
//   return (
//     <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-4 border border-gray-400 dark:border-gray-1000">
//       <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Who to follow</h2>
//       {/* Liste des suggestions */}
//       <div className="space-y-2">
//         {suggestionsData.map(suggestion => (
//           <div key={suggestion.id} className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
//             <img src={suggestion.profileImage} alt="Profile" className="rounded-full h-10 w-10 mr-2" />
//             <div>
//               <p className="text-gray-900 dark:text-white font-bold">
//                 {suggestion.name}
//                 {suggestion.isVerified && <VerifiedBadge />} {/* Afficher le badge si l'utilisateur est vérifié */}
//               </p>
//               <p className="text-gray-500 dark:text-gray-400">@{suggestion.username}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Suggestions;