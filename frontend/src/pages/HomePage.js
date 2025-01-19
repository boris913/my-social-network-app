import React, { useEffect, useMemo, useState } from 'react';
// import { useLocation } from 'react-router-dom';
import Trends from '../components/Trends';
import Suggestions from '../components/Suggestions';
import NewTweet from '../components/NewTweet';
import Tweet from '../components/Tweet';

function HomePage({ tweets, addNewTweet, updateComments, updateLikes, setUser }) {
  // Récupérer l'utilisateur depuis localStorage
  const storedUser = localStorage.getItem('user');
  const userFromLocalStorage = storedUser ? JSON.parse(storedUser) : null;

  // Utiliser l'utilisateur depuis localStorage ou un utilisateur par défaut
  const user = useMemo(() => {
    return userFromLocalStorage || {
      username: 'Anonymous',
      email: 'No email',
      bio: 'No bio',
      profile_picture: 'default-profile.png'
    };
  }, [userFromLocalStorage]);

  useEffect(() => {
    // Mettre à jour l'utilisateur dans l'état global si nécessaire
    if (userFromLocalStorage) {
      setUser(userFromLocalStorage);
    }
  }, [userFromLocalStorage, setUser]);

  // État pour contrôler l'affichage de la div
  const [showDiv, setShowDiv] = useState(false);

  useEffect(() => {
    // Afficher la div
    setShowDiv(true);

    // Masquer la div après 3 secondes
    const timer = setTimeout(() => {
      setShowDiv(false);
    }, 3000);

    // Nettoyer le timer si le composant est démonté
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-full w-full space-x-4 bg-gray-100 dark:bg-gray-900 border-b border-gray-400 dark:border-gray-1000" style={{ paddingTop: '27px' }}>
      <div className="flex-1">
        <NewTweet addNewTweet={addNewTweet} />
        <div>
          {tweets.map(tweet => (
            <Tweet key={tweet.id} tweet={tweet} updateComments={updateComments} updateLikes={updateLikes} />
          ))}
        </div>
      </div>
      <div className="w-1/4">
        <Trends />
        <Suggestions />
      </div>
      {/* Afficher le nom d'utilisateur */}
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Autres composants de votre application */}
        {showDiv && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-200 dark:bg-gray-800 p-4 text-center">
            <span className="text-green-800 font-semibold">
              Connected as: {user.username}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;