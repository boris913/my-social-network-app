import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChatBubbleOvalLeftIcon, ArrowsRightLeftIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import TweetButton from './TweetButton';
import VerifiedBadge from './VerifiedBadge';
import Modal from './Modal';
import axios from 'axios';
import '../css/Tweet.css';

function Tweet({ tweet, isRetweet = false }) {
  const [comments, setComments] = useState([]);
  const [retweets, setRetweets] = useState(tweet.retweets || 0);
  const [likes, setLikes] = useState(tweet.likes || 0);
  const [shares, setShares] = useState(tweet.shares || 0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [content, setContent] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user')); // Supposons que l'ID de l'utilisateur connecté soit stocké dans le localStorage
  const currentUserId = currentUser.id; // Supposons que l'ID de l'utilisateur connecté soit stocké dans le localStorage

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/comments/${tweet.id}`);
        setComments(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des commentaires:', error);
      }
    };

    const fetchLikes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/likes/tweet/${tweet.id}`);
        setLikes(response.data.length);
        setIsLiked(response.data.some(like => like.userId === currentUserId));
      } catch (error) {
        console.error('Erreur lors de la récupération des likes:', error);
      }
    };

    const fetchRetweets = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/retweets/tweet/${tweet.id}`);
        setRetweets(response.data.length);
        setIsRetweeted(response.data.some(retweet => retweet.userId === currentUserId));
      } catch (error) {
        console.error('Erreur lors de la récupération des retweets:', error);
      }
    };

    fetchComments();
    fetchLikes();
    fetchRetweets();
  }, [tweet.id, currentUserId]);

  const handleComment = () => {
    setShowCommentInput(true);
  };

  const handleAddComment = async () => {
    if (content.trim()) {
      try {
        await axios.post(`http://localhost:5000/api/comments`, {
          content: content,
          tweetId: tweet.id,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setContent('');
        setShowCommentInput(false);
        setConfirmationMessage('Commentaire ajouté avec succès !');
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
        setComments([...comments, { id: Date.now(), user: 'Utilisateur actuel', content: content, profileImage: 'https://picsum.photos/seed/currentuser/40', responses: [] }]);
      } catch (error) {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
      }
    }
  };

  const handleRetweet = async () => {
    try {
      if (isRetweeted) {
        // Supprimer le retweet
        const response = await axios.get(`http://localhost:5000/api/retweets/tweet/${tweet.id}`);
        const retweet = response.data.find(retweet => retweet.userId === currentUserId);

        if (retweet) {
          await axios.delete(`http://localhost:5000/api/retweets/${retweet.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setIsRetweeted(false);
          setRetweets(retweets - 1);
          setConfirmationMessage('Retweet supprimé avec succès !');
          setShowConfirmation(true);
          setTimeout(() => setShowConfirmation(false), 2000);
        }
      } else {
        // Créer un retweet
        await axios.post(`http://localhost:5000/api/retweets`, {
          tweetId: tweet.id,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setIsRetweeted(true);
        setRetweets(retweets + 1);
        setConfirmationMessage('Retweet ajouté avec succès !');
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
      }
    } catch (error) {
      console.error('Erreur lors du retweet:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        // Supprimer le like
        const response = await axios.get(`http://localhost:5000/api/likes/tweet/${tweet.id}`);
        const like = response.data.find(like => like.userId === currentUserId);

        if (like) {
          await axios.delete(`http://localhost:5000/api/likes/${like.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setIsLiked(false);
          setLikes(likes - 1);
          setConfirmationMessage('Like supprimé avec succès !');
          setShowConfirmation(true);
          setTimeout(() => setShowConfirmation(false), 2000);
        }
      } else {
        // Créer un like
        await axios.post(`http://localhost:5000/api/likes`, {
          tweetId: tweet.id,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setIsLiked(true);
        setLikes(likes + 1);
        setConfirmationMessage('Like ajouté avec succès !');
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
      }
    } catch (error) {
      console.error('Erreur lors du like/unlike:', error);
    }
  };

  const handleShare = async () => {
    try {
      await axios.post(`http://localhost:5000/api/tweets/${tweet.id}/shares`, null, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setShares(shares + 1);
      setConfirmationMessage('Partage ajouté avec succès !');
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  // Base URL du serveur backend
  const BASE_URL = 'http://localhost:5000';

  // Construction de l'URL complète pour la photo de profil
  const profilePictureUrl = tweet.User?.profile_picture?.startsWith('/uploads/')
    ? `${BASE_URL}${tweet.User.profile_picture}`
    : tweet.User?.profile_picture || 'default-profile-picture-url';

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 border border-gray-400 dark:border-gray-1000">
      {isRetweet && (
        <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Vous avez retweeté</div>
      )}
      <Link to={`/tweet/${tweet.id}`} className="block">
        <div className="flex items-center space-x-4">
          <img src={profilePictureUrl} alt="Profile" className="h-12 w-12 rounded-full" />
          <div>
            <div className="text-gray-900 dark:text-white font-bold">
              {tweet.User?.username}
              <VerifiedBadge />
            </div>
            <div className="text-gray-500 dark:text-gray-400">@{tweet.User?.username}</div>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mt-2">{tweet.content}</p>
      </Link>
      <div className="flex justify-between items-center mt-4">
        <TweetButton Icon={ChatBubbleOvalLeftIcon} label="Comments" onClick={handleComment} count={comments.length} />
        <TweetButton Icon={ArrowsRightLeftIcon} label="Retweet" onClick={handleRetweet} count={retweets} className={`retweet-button ${isRetweeted ? 'retweeted' : ''}`} />
        <TweetButton
          Icon={HeartIcon}
          label="Like"
          onClick={handleLike}
          count={likes}
          className={`like-button ${isLiked ? 'liked' : ''}`}
        />
        <TweetButton Icon={ShareIcon} label="Share" onClick={handleShare} count={shares} />
      </div>
      <Modal isOpen={showCommentInput} onClose={() => setShowCommentInput(false)}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Laissez votre réponse..."
          className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none"
        />
        <button onClick={handleAddComment} className="mt-2 p-2 bg-blue-500 text-white rounded-lg">
          Répondre
        </button>
      </Modal>
      {showConfirmation && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg">
          {confirmationMessage}
        </div>
      )}
    </div>
  );
}

export default Tweet;