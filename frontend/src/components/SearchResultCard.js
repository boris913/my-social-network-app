import React from 'react';
import { Link } from 'react-router-dom';
import TweetCard from './TweetCard';
import VerifiedBadge from './VerifiedBadge';

function SearchResultCard({ result, type }) {
  if (type === 'tweet') {
    return <TweetCard tweet={result} />;
  }

  const profilePictureUrl = result.profile_picture && result.profile_picture.startsWith('/uploads/')
    ? `http://localhost:5000${result.profile_picture}`
    : result.profile_picture || 'https://picsum.photos/seed/default/40';

  return (
    <div
      className="search-result-card p-2 border-b border-gray-300 bg-white text-black transition-colors duration-300 rounded-lg shadow-sm mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <Link to={`/profile/${result.id}`} className="flex items-center space-x-4">
        <img
          src={profilePictureUrl}
          alt={result.username}
          className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-700"
        />
        <div>
          <p className="text-lg font-bold flex items-center">
            {result.username}
            {result.isVerified && <VerifiedBadge />} {/* Ajouter le badge vérifié */}
            {<VerifiedBadge />} {/* Ajouter le badge vérifié */}
          </p>
          <p className="text-sm text-gray-500">@{result.username}</p>
        </div>
      </Link>
    </div>
  );
}

export default SearchResultCard;