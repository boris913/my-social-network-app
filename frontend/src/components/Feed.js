import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TweetCard from '../components/TweetCard';

function Feed() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tweets/feed', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFeed(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du fil d\'actualités:', error);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div>
      {feed.map(tweet => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
}

export default Feed;