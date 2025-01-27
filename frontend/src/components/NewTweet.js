import React, { useState } from 'react';
import { PhotoIcon, FaceSmileIcon, CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function NewTweet({ addNewTweet }) {
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleTweet = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/tweets', {
        content: content,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      addNewTweet(response.data);

      setContent('');
      setSubmitted(true);
      setError(null);

      // Afficher le toast de succès
      toast.success("Tweet publié avec succès !");

      // Attendre 3 secondes avant de rediriger vers la HomePage
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la publication du tweet:', error);
      setError('Erreur lors de la publication du tweet. Veuillez réessayer.');

      // Afficher le toast d'erreur
      toast.error('Erreur lors de la publication du tweet. Veuillez réessayer.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 border border-gray-400 dark:border-gray-1000">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Qu'est-ce qui se passe ?"
        className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none"
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <PhotoIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaceSmileIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <MapPinIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ClockIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
          </button>
        </div>
        <button
          onClick={handleTweet}
          className={`bg-blue-500 text-white py-2 px-4 rounded-full ${content ? '' : 'opacity-50 cursor-not-allowed'}`}
          disabled={!content}
        >
          Tweeter
        </button>
      </div>
      {submitted && (
        <div className="mt-2 text-green-500">
          publié !
        </div>
      )}
      {error && (
        <div className="mt-2 text-red-500">
          {error}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default NewTweet;