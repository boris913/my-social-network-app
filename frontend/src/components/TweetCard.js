import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChatBubbleOvalLeftIcon, ArrowsRightLeftIcon, HeartIcon, ShareIcon, PencilSquareIcon, TrashIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import TweetButton from './TweetButton';
import VerifiedBadge from './VerifiedBadge';
import Modal from './Modal';
import axios from 'axios';
import '../css/Tweet.css';

function TweetCard({ tweet, onUpdate, onDelete, retweeter }) {
  const [comments, setComments] = useState([]);
  const [retweets, setRetweets] = useState(tweet.retweets || 0);
  const [likes, setLikes] = useState(tweet.likes || 0);
  const [shares, setShares] = useState(tweet.shares || 0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [content, setContent] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserId = currentUser.id;

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

    const fetchShares = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shares/tweet/${tweet.id}`);
        setShares(response.data.length);
        setIsShared(response.data.some(share => share.userId === currentUserId));
      } catch (error) {
        console.error('Erreur lors de la récupération des partages:', error);
      }
    };

    fetchComments();
    fetchLikes();
    fetchRetweets();
    fetchShares();
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
      const response = await axios.get(`http://localhost:5000/api/shares/tweet/${tweet.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const existingShare = response.data.find(share => share.userId === currentUserId);
      console.log(existingShare)

      if (existingShare) {
        await axios.delete(`http://localhost:5000/api/shares/${existingShare.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setShares(shares - 1);
        setIsShared(false);
        setConfirmationMessage('Partage supprimé avec succès !');
      } else {
        await axios.post(`http://localhost:5000/api/shares`, {
          tweetId: tweet.id,
          platform: 'twitter'
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setShares(shares + 1);
        setIsShared(true);
        setConfirmationMessage('Partage ajouté avec succès !');
      }
      
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);

    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tweets/${tweet.id}`, {
        content: editContent,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      onUpdate(response.data);
      setShowEditModal(false);
      setConfirmationMessage('Tweet mis à jour avec succès !');
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du tweet:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/tweets/${tweet.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      onDelete(tweet.id);
      setConfirmationMessage('Tweet supprimé avec succès !');
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la suppression du tweet:', error);
    }
  };

  const BASE_URL = 'http://localhost:5000';

  const profilePictureUrl = tweet.User?.profile_picture?.startsWith('/uploads/')
    ? `${BASE_URL}${tweet.User.profile_picture}`
    : tweet.User?.profile_picture || 'default-profile-picture-url';

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 border border-gray-400 dark:border-gray-1000 relative">
      {tweet.isRetweet && (
        <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
        <ArrowsRightLeftIcon className="w-5 h-5 inline-block mr-1" />
          {retweeter?.id === currentUserId ? 'Vous avez retweeté !' : `${retweeter?.username} a retweeté !`}
        </div>
      )}
      <div className="absolute top-2 right-2">
        {tweet.userId === currentUserId && (
          <>
            <button onClick={toggleMenu}>
              <EllipsisHorizontalIcon className="h-7 w-7 text-gray-500 dark:text-gray-400" />
            </button>
            {menuVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg">
                <button onClick={() => setShowEditModal(true)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <PencilSquareIcon className="h-5 w-5 mr-2" />
                  Edit
                </button>
                <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Link to={`/tweet/${tweet.id}`} className="block">
        <div className="flex items-center space-x-4">
          <Link to={`/profile/${tweet.User?.id}`}>
            <img src={profilePictureUrl} alt="Profile" className="h-12 w-12 rounded-full" />
          </Link>
          <div>
            <Link to={`/profile/${tweet.User?.id}`}>
              <div className="text-gray-900 dark:text-white font-bold">
                {tweet.User?.username}
                <VerifiedBadge />
              </div>
            </Link>
            <Link to={`/profile/${tweet.User?.id}`}>
              <div className="text-gray-500 dark:text-gray-400">@{tweet.User?.username}</div>
            </Link>
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
        <TweetButton Icon={ShareIcon} label="Share" onClick={handleShare} count={shares} className={`share-button ${isShared ? 'shared' : ''}`} />
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
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="Modifier votre tweet..."
          className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none"
        />
        <button onClick={handleUpdate} className="mt-2 p-2 bg-blue-500 text-white rounded-lg">
          Mettre à jour
        </button>
      </Modal>
      {showConfirmation && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50">
          {confirmationMessage}
        </div>
      )}
    </div>
  );
}

export default TweetCard;