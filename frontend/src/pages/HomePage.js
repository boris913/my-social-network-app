import React, { useState, useEffect } from 'react';
import NewTweet from '../components/NewTweet';
import TweetCard from '../components/TweetCard';
import Trends from '../components/Trends';
import Suggestions from '../components/Suggestions';
import SearchResultsPage from './SearchResultsPage';
import axios from 'axios';

function HomePage({ user, logout, searchType, searchQuery }) { // Recevoir user, logout, searchType et searchQuery en tant que props
  const [tweets, setTweets] = useState([]);

  const fetchTweets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tweets');
      setTweets(response.data);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const addNewTweet = (newTweet) => {
    setTweets([newTweet, ...tweets]);
  };

  const updateTweet = (updatedTweet) => {
    const updatedTweets = tweets.map(tweet =>
      tweet.id === updatedTweet.id ? updatedTweet : tweet
    );
    setTweets(updatedTweets);
  };

  const deleteTweet = (tweetId) => {
    const updatedTweets = tweets.filter(tweet => tweet.id !== tweetId);
    setTweets(updatedTweets);
  };

  const updateLikes = (tweetId, newLikes) => {
    const updatedTweets = tweets.map(tweet =>
      tweet.id === tweetId ? { ...tweet, likes: newLikes } : tweet
    );
    setTweets(updatedTweets);
  };

  const updateComments = (tweetId, updatedComments) => {
    const updatedTweets = tweets.map(tweet =>
      tweet.id === tweetId ? { ...tweet, comments: updatedComments } : tweet
    );
    setTweets(updatedTweets);
  };

  return (
    <div className="flex h-full w-full space-x-4 bg-gray-100 dark:bg-gray-900 border-b border-gray-400 dark:border-gray-1000" style={{ paddingTop: '27px' }}>
      <div className="flex-1">
        {searchQuery ? (
          <SearchResultsPage type={searchType} query={searchQuery} />
        ) : (
          <>
            <NewTweet addNewTweet={addNewTweet} />
            <div>
              {tweets.map(tweet => (
                <TweetCard key={tweet.id} tweet={tweet} onUpdate={updateTweet} onDelete={deleteTweet} updateComments={updateComments} updateLikes={updateLikes} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="w-1/4">
        <Trends />
        <Suggestions />
      </div>
    </div>
  );
}

export default HomePage;