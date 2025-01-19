import React, { useState } from 'react';
import { PhotoIcon, FaceSmileIcon, CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

function NewTweet({ addNewTweet }) {
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleTweet = () => {
    const newTweet = {
      id: Date.now(),
      user: 'Utilisateur actuel',
      username: 'currentuser',
      content: content,
      profileImage: 'https://picsum.photos/seed/currentuser/50',
      isVerified: false,
      responses: [],
    };

    addNewTweet(newTweet);
    setContent('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 border border-gray-400 dark:border-gray-1000">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
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
          Tweet
        </button>
      </div>
      {submitted && (
        <div className="mt-2 text-green-500">
          Tweet submitted!
        </div>
      )}
    </div>
  );
}

export default NewTweet;