//ProfilePage.js
import React from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext'; // Importer le contexte

function ProfilePage() {
  const { user } = useAuth(); // Récupérer les informations de l'utilisateur connecté

  if (!user) {
    return <div>Loading...</div>; // Gérer l'état de chargement
  }

  // Données statiques pour les autres informations
  const staticData = {
    tweetsCount: 123,
    followersCount: 456,
    followingCount: 789,
    tweets: [
      { id: 1, content: 'This is my first tweet!', date: '2025-01-01' },
      { id: 2, content: 'Hello Twitter!', date: '2025-01-02' },
    ],
  };
  // Base URL du serveur backend
  const BASE_URL = 'http://localhost:5000';

  // Construction de l'URL complète pour la photo de profil
  const profilePictureUrl = user.profile_picture.startsWith('/uploads/')
    ? `${BASE_URL}${user.profile_picture}`
    : user.profile_picture;
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border border-gray-400 dark:border-gray-1000">
      <div className="flex items-center mb-4">
        <img
          src= {profilePictureUrl|| 'https://picsum.photos/seed/currentuser/150'}
          alt="Profile"
          className="h-20 w-20 rounded-full border border-gray-300 dark:border-gray-700"
        />
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.username}</h2>
          <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">{user.bio}</p>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <div>
          <span className="text-gray-900 dark:text-white font-bold">{staticData.tweetsCount}</span>
          <span className="text-gray-500 dark:text-gray-400"> Tweets</span>
        </div>
        <div>
          <span className="text-gray-900 dark:text-white font-bold">{staticData.followersCount}</span>
          <span className="text-gray-500 dark:text-gray-400"> Followers</span>
        </div>
        <div>
          <span className="text-gray-900 dark:text-white font-bold">{staticData.followingCount}</span>
          <span className="text-gray-500 dark:text-gray-400"> Following</span>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Follow
        </button>
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          <EnvelopeIcon className="h-5 w-5 inline-block mr-2" />
          Message
        </button>
      </div>
      <div className="space-y-4">
        {staticData.tweets.map((tweet) => (
          <div key={tweet.id} className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow border border-gray-300 dark:border-gray-700">
            <p className="text-gray-900 dark:text-white">{tweet.content}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{tweet.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;