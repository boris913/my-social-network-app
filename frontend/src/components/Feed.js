import React, { useEffect, useState } from 'react';
import Tweet from './Tweet';

function Feed() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    fetch('/path/to/tweets.json') // Remplacez par le chemin correct vers votre fichier JSON
      .then(response => response.json())
      .then(data => setTweets(data))
      .catch(error => console.error('Error fetching tweets:', error));
  }, []);

  return (
    <div className="feed">
      {tweets.map(tweet => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
}

export default Feed;