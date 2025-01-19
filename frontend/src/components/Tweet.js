import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChatBubbleOvalLeftIcon, ArrowsRightLeftIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import TweetButton from './TweetButton';
import VerifiedBadge from './VerifiedBadge';
import Modal from './Modal';
import '../css/Tweet.css'; // Importer le fichier CSS pour les animations

function Tweet({ tweet, updateComments, updateLikes }) {
  const [comments, setComments] = useState(tweet.responses || []);
  const [retweets, setRetweets] = useState(tweet.retweets || 0);
  const [likes, setLikes] = useState(tweet.likes || 0);
  const [share, setShare] = useState(tweet.shares || 0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [content, setContent] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setLikes(tweet.likes);
  }, [tweet.likes]);

  const handleComment = (event) => {
    event.preventDefault();
    setShowCommentInput(true);
  };

  const handleAddComment = () => {
    if (content.trim()) {
      const updatedComments = [
        ...comments,
        {
          id: comments.length + 1,
          user: 'Utilisateur actuel',
          content: content,
          profileImage: 'https://picsum.photos/seed/currentuser/40',
          responses: []
        }
      ];
      setComments(updatedComments);
      updateComments(tweet.id, updatedComments);
      setContent('');
      setShowCommentInput(false);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    }
  };

  const handleRetweet = (event) => {
    event.preventDefault();
    setRetweets(retweets + 1);
    alert('Retweeté !');
  };

  const handleLike = (event) => {
    event.preventDefault();
    const newLikes = isLiked ? likes - 1 : likes + 1;
    setIsLiked(!isLiked);
    setLikes(newLikes);
    updateLikes(tweet.id, newLikes);
  };

  const handleShare = (event) => {
    event.preventDefault();
    alert('Partager ce tweet !');
    setShare(share + 1);
  };

  const countAllComments = (responses) => {
    let count = responses.length;
    responses.forEach(response => {
      if (response.responses) {
        count += countAllComments(response.responses);
      }
    });
    return count;
  };

  const totalComments = countAllComments(comments);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 border border-gray-400 dark:border-gray-1000">
      <Link to={`/tweet/${tweet.id}`} className="block">
        <div className="flex items-center space-x-4">
          <img src={tweet.profileImage} alt="Profile" className="h-12 w-12 rounded-full" />
          <div>
            <div className="text-gray-900 dark:text-white font-bold">
              {tweet.user}
              {tweet.isVerified && <VerifiedBadge />} {/* Afficher le badge si l'utilisateur est vérifié */}
            </div>
            <div className="text-gray-500 dark:text-gray-400">@{tweet.username}</div>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mt-2">{tweet.content}</p>
      </Link>
      <div className="flex justify-between items-center mt-4">
        <TweetButton Icon={ChatBubbleOvalLeftIcon} label="Comment" onClick={handleComment} count={totalComments} />
        <TweetButton Icon={ArrowsRightLeftIcon} label="Retweet" onClick={handleRetweet} count={retweets} />
        <TweetButton
          Icon={HeartIcon}
          label="Like"
          onClick={handleLike}
          count={likes}
          className={`like-button ${isLiked ? 'liked' : ''}`}
        />
        <TweetButton Icon={ShareIcon} label="Share" onClick={handleShare} count={share} />
      </div>
      <Modal isOpen={showCommentInput} onClose={() => setShowCommentInput(false)}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comment"
          className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none"
        />
        <button onClick={handleAddComment} className="mt-2 p-2 bg-blue-500 text-white rounded-lg">
          Comment
        </button>
      </Modal>
      {showConfirmation && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg">
          Comment added successfully!
        </div>
      )}
    </div>
  );
}

export default Tweet;