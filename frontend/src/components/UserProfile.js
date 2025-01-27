import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TweetCard from './TweetCard';

const UserProfile = ({ userId }) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchUserTweets = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tweets/user/${userId}`);
        setTweets(response.data);
      } catch (error) {
        console.error('Error fetching user tweets:', error);
      }
    };
    if (userId) {
      fetchUserTweets();
    }
  }, [userId]);

  return (
    <div>
      <h2>User Tweets</h2>
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
};

export default UserProfile;