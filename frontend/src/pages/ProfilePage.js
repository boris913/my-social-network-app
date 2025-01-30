import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext'; // Importer le contexte
import VerifiedBadge from '../components/VerifiedBadge';
import axios from 'axios';
import TweetCard from '../components/TweetCard'; // Importer TweetCard

function ProfilePage() {
  const { user: currentUser } = useAuth(); // Récupérer les informations de l'utilisateur connecté
  const { userId } = useParams(); // Récupérer l'ID de l'utilisateur à partir de l'URL
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]); // Ajouter un état pour les tweets likés
  const [comments, setComments] = useState([]); // Ajouter un état pour les commentaires
  const [loading, setLoading] = useState(true); // Ajouter un état de chargement
  const [activeTab, setActiveTab] = useState('posts'); // État pour l'onglet actif
  const [follows, setFollows] = useState([]); // Ajouter un état pour les abonnements
  const [followers, setFollowers] = useState([]); // Ajouter un état pour les abonnés
// console.log("current user:", currentUser);
// console.log("profile_user:",user);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  useEffect(() => {
    const fetchUserTweetsAndRetweets = async () => {
      try {
        // Récupérer les tweets de l'utilisateur
        const tweetsResponse = await axios.get(`http://localhost:5000/api/tweets/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Récupérer les retweets de l'utilisateur
        const retweetsResponse = await axios.get(`http://localhost:5000/api/retweets/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Combiner les tweets et les retweets
        const combinedTweets = [
          ...tweetsResponse.data,
          ...retweetsResponse.data.map(retweet => ({ ...retweet, isRetweet: true, retweeter: user }))
        ];

        setTweets(combinedTweets);
      } catch (error) {
        console.error('Erreur lors de la récupération des tweets et retweets de l\'utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && activeTab === 'posts') {
      fetchUserTweetsAndRetweets();
    }
  }, [userId, activeTab, user]);

  useEffect(() => {
    const fetchLikedTweets = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/likes/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setLikedTweets(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tweets likés:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && activeTab === 'likes') {
      fetchLikedTweets();
    }
  }, [userId, activeTab]);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/comments/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setComments(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des commentaires de l\'utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && activeTab === 'replies') {
      fetchUserComments();
    }
  }, [userId, activeTab]);

  useEffect(() => {
    const fetchFollows = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/follows/follows/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFollows(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des abonnements:', error);
      }
    };

    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/follows/followers/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFollowers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des abonnés:', error);
      }
    };

    fetchFollows();
    fetchFollowers();
  }, [userId]);

  const handleFollow = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/follows`, {
        followingId: userId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFollowers([...followers, response.data]); // Add the new follow to the follows state
    } catch (error) {
      console.error('Erreur lors du suivi de l\'utilisateur:', error);
    }
  };
  console.log(currentUser)
  console.log(user)
  console.log("following" ,follows)
  console.log("followers", followers)

  const handleUnfollow = async () => {
    try {
      const follow = followers.find(follower => follower.followerId === currentUser.id);
      if (follow) {
        await axios.delete(`http://localhost:5000/api/follows/${follow.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFollowers(followers.filter(follower => follower.followerId !== currentUser.id)); // Remove the follow from the follows state
      }
    } catch (error) {
      console.error('Erreur lors du désabonnement de l\'utilisateur:', error);
    }
  };

  const handleUpdateTweet = (updatedTweet) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) => (tweet.id === updatedTweet.id ? updatedTweet : tweet))
    );
  };

  const handleDeleteTweet = (tweetId) => {
    setTweets((prevTweets) => prevTweets.filter((tweet) => tweet.id !== tweetId));
  };

  if (!user || loading) {
    return <div>Loading...</div>; // Gérer l'état de chargement
  }

  // Base URL du serveur backend
  const BASE_URL = 'http://localhost:5000';

  // Construction de l'URL complète pour la photo de profil
  const profilePictureUrl = user.profile_picture.startsWith('/uploads/')
    ? `${BASE_URL}${user.profile_picture}`
    : user.profile_picture;

  const tabClass = (tab) => (
    `cursor-pointer p-2 text-xl font-bold ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-900 dark:text-gray-100'}`
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border border-gray-400 dark:border-gray-1000">
      <div className="flex items-center mb-4">
        <img
          src={profilePictureUrl || 'https://picsum.photos/seed/currentuser/150'}
          alt="Profile"
          className="h-20 w-20 rounded-full border border-gray-300 dark:border-gray-700"
        />
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.username}
          { <VerifiedBadge />}</h2>
          <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">{user.bio}</p>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <div>
          <span className="text-gray-900 dark:text-white font-bold">{tweets.length}</span>
          <span className="text-gray-500 dark:text-gray-400"> Tweets</span>
        </div>
        <div>
          <span className="text-gray-900 dark:text-white font-bold">{followers.length}</span>
          <span className="text-gray-500 dark:text-gray-400"> Followers</span>
        </div>
        <div>
          <span className="text-gray-900 dark:text-white font-bold">{follows.length}</span>
          <span className="text-gray-500 dark:text-gray-400"> Following</span>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        {currentUser.id !== user.id && (
          followers.some(follower => follower.followerId === currentUser.id) ? (
            <button onClick={handleUnfollow} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Unfollow
            </button>
          ) : (
            <button onClick={handleFollow} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Follow
            </button>
          )
        )}
        {currentUser.id !== user.id && (
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            <EnvelopeIcon className="h-5 w-5 inline-block mr-2" />
            Message
          </button>
        )}
      </div>
      
      <div className="flex justify-center space-x-4 mb-4 border-b-2 border-gray-300 dark:border-gray-700">
        <div className={tabClass('posts')} onClick={() => setActiveTab('posts')}>Posts</div>
        <div className={tabClass('replies')} onClick={() => setActiveTab('replies')}>Replies</div>
        <div className={tabClass('media')} onClick={() => setActiveTab('media')}>Media</div>
        <div className={tabClass('likes')} onClick={() => setActiveTab('likes')}>Likes</div>
      </div>

      <div className="space-y-8">
        {activeTab === 'posts' && (
          <>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">Posts</h3>
            {tweets.map((tweet) => (
              tweet && (
                <TweetCard 
                  key={tweet.id} 
                  tweet={tweet} 
                  isRetweet={tweet.isRetweet} 
                  retweeter={tweet.retweeter} 
                  onUpdate={handleUpdateTweet} 
                  onDelete={handleDeleteTweet} 
                />
              )
            ))}
          </>
        )}
        {activeTab === 'replies' && (
          <>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">Replies</h3>
            {comments.length > 0 ? (
              comments.map((comment) => (
                comment && comment.User && comment.Tweet && (
                  <div key={comment.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow mb-4 border border-gray-400 dark:border-gray-1000">
                    <div className="flex items-center space-x-4">
                      <img
                        src={comment.User.profile_picture.startsWith('/uploads/')
                          ? `${BASE_URL}${comment.User.profile_picture}`
                          : comment.User.profile_picture}
                        alt="Profile"
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <div className="text-gray-900 dark:text-white font-bold">
                          <Link to={`/profile/${comment.User.id}`}>{comment.User.username}</Link>
                          <VerifiedBadge />
                        </div>
                        <div className="text-gray-500 dark:text-gray-300">@{comment.User.username}</div>
                        {comment.parentCommentId === null ? (
                          <div className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-3">
                            En réponse à <Link to={`/profile/${comment.Tweet.User.id}`} className="text-blue-500">@{comment.Tweet.User.username}</Link>
                          </div>
                        ) : (
                          comment.ParentComment && comment.ParentComment.User && (
                            <div className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-3">
                              En réponse à <Link to={`/profile/${comment.ParentComment.User.id}`} className="text-blue-500">@{comment.ParentComment.User.username}</Link>
                            </div>
                          )
                        )}
                        <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                )
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No replies yet.</p>
            )}
          </>
        )}
        {activeTab === 'media' && (
          <>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">Media</h3>
            {/* Ajouter le code pour afficher les médias */}
            <p className="text-gray-500 dark:text-gray-400">No media yet.</p>
          </>
        )}
        {activeTab === 'likes' && (
          <>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">Likes</h3>
            {likedTweets.length > 0 ? (
              likedTweets.map((tweet) => (
                tweet && (
                  <TweetCard 
                    key={tweet.id} 
                    tweet={tweet} 
                    isRetweet={tweet.isRetweet} 
                    retweeter={tweet.retweeter} 
                    onUpdate={handleUpdateTweet} 
                    onDelete={handleDeleteTweet} 
                  />
                )
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No likes yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;