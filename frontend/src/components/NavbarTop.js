import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import VerifiedBadge from './VerifiedBadge';
import SearchBar from './SearchBar'; // Importer le composant SearchBar

function NavbarTop({ user, onLogout, onSearch }) { // Ajouter onSearch comme prop
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Vérifier si user est défini avant d'accéder à ses propriétés
  if (!user) {
    return null;
  }

  // Base URL du serveur backend
  const BASE_URL = 'http://localhost:5000';

  // Construction de l'URL complète pour la photo de profil
  const profilePictureUrl = user.profile_picture && user.profile_picture.startsWith('/uploads/')
    ? `${BASE_URL}${user.profile_picture}`
    : user.profile_picture || 'https://picsum.photos/seed/default/40';

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-full p-4 flex justify-between items-center border-b border-gray-400 dark:border-gray-1000 fixed top-0 z-50">
      <div className="flex items-center">
        <Link to="/profile">
          <img
            src={profilePictureUrl}
            alt="Profil"
            className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-700"
            onError={(e) => { e.target.src = 'https://picsum.photos/seed/currentuser/40'; }} // Fallback si l'image échoue à charger
          />
        </Link>
        <div className="ml-4">
          <Link to="/profile" className="text-lg font-bold hover:underline">
            {user.username}
          </Link>
          <VerifiedBadge />
          <p className="text-sm">@{user.username}</p>
        </div>
      </div>
      <div className="flex-grow mx-4 flex justify-end">
        <SearchBar onSearch={onSearch} /> {/* Passer la fonction onSearch à SearchBar */}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" /> {/* Ajout de l'icône de déconnexion */}
        Logout
      </button>
    </nav>
  );
}

export default NavbarTop;