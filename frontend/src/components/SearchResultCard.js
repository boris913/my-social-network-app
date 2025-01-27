import React from 'react';
import { Link } from 'react-router-dom';
import TweetCard from './TweetCard';
import '../css/SearchResultCard.css'; // Assurez-vous d'avoir un fichier CSS pour les styles spécifiques

function SearchResultCard({ result, type }) {
  if (type === 'tweet') {
    return <TweetCard tweet={result} />;
  }

  const profilePictureUrl = result.profile_picture && result.profile_picture.startsWith('/uploads/')
    ? `http://localhost:5000${result.profile_picture}`
    : result.profile_picture || 'https://picsum.photos/seed/default/40';

  return (
    <div className="search-result-card">
      <Link to={`/profile/${result.id}`} className="flex items-center space-x-4">
        <img
          src={profilePictureUrl}
          alt={result.username}
          className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-700"
        />
        <div>
          <p className="text-lg font-bold">{result.username}</p>
          <p className="text-sm text-gray-500">@{result.username}</p>
        </div>
      </Link>
    </div>
  );
}

export default SearchResultCard;