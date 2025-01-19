import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TweetButton from '../components/TweetButton';
import VerifiedBadge from '../components/VerifiedBadge';
import Modal from '../components/Modal';
import { ChatBubbleOvalLeftIcon, ArrowsRightLeftIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import '../css/Tweet.css'; // Importer le fichier CSS pour les animations

function TweetDetail({ tweets, updateComments, updateLikes }) {
  const { tweetId } = useParams();
  const tweet = tweets.find(t => t.id === parseInt(tweetId));

  const [comments, setComments] = useState(tweet ? tweet.responses ?? [] : []);
  const [likes, setLikes] = useState(tweet ? tweet.likes ?? 0 : 0);
  const [retweets, setRetweets] = useState(tweet ? tweet.retweets ?? 0 : 0);
  const [shares, setShares] = useState(tweet ? tweet.shares ?? 0 : 0);
  const [content, setContent] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [replyContent, setReplyContent] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState(null);

  useEffect(() => {
    if (tweet) {
      setComments(tweet.responses ?? []);
      setLikes(tweet.likes ?? 0);
      setRetweets(tweet.retweets ?? 0);
      setShares(tweet.shares ?? 0);
    }
  }, [tweet]);

  if (!tweet) {
    return <div>Tweet not found</div>;
  }

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

  const handleAddComment = () => {
    if (content.trim()) {
      const updatedComments = [
        ...comments,
        {
          id: comments.length + 1,
          user: 'Current User',
          username: 'currentuser',
          content: content,
          profileImage: 'https://picsum.photos/seed/currentuser/40',
          responses: [],
          likes: 0,
          retweets: 0,
          shares: 0,
        },
      ];
      setComments(updatedComments);
      updateComments(tweet.id, updatedComments);
      setContent('');
      setShowCommentInput(false);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    }
  };

  const handleCommentResponse = () => {
    if (replyContent.trim() && replyToCommentId !== null) {
      const updatedComments = comments.map(comment =>
        comment.id === replyToCommentId
          ? {
              ...comment,
              responses: [
                ...(comment.responses || []),
                {
                  id: (comment.responses ? comment.responses.length : 0) + 1,
                  user: 'Current User',
                  username: 'currentuser',
                  content: replyContent,
                  profileImage: 'https://picsum.photos/seed/currentuser/40',
                  responses: [],
                  likes: 0,
                  retweets: 0,
                  shares: 0,
                },
              ],
            }
          : comment
      );
      setComments(updatedComments);
      updateComments(tweet.id, updatedComments);
      setReplyContent('');
      setShowReplyInput(false);
      setReplyToCommentId(null);
    }
  };

  const handleLike = (event) => {
    event.preventDefault();
    const newLikes = isLiked ? likes - 1 : likes + 1;
    setIsLiked(!isLiked);
    setLikes(newLikes);
    updateLikes(tweet.id, newLikes);
  };

  const handleLikeComment = (commentId) => {
    const updatedComments = comments.map(comment =>
      comment.id === commentId ? { ...comment, likes: (comment.likes || 0) + 1 } : comment
    );
    setComments(updatedComments);
    updateComments(tweet.id, updatedComments);
  };

  const handleRetweetComment = (commentId) => {
    const updatedComments = comments.map(comment =>
      comment.id === commentId ? { ...comment, retweets: (comment.retweets || 0) + 1 } : comment
    );
    setComments(updatedComments);
    updateComments(tweet.id, updatedComments);
  };

  const handleShareComment = (commentId) => {
    const updatedComments = comments.map(comment =>
      comment.id === commentId ? { ...comment, shares: (comment.shares || 0) + 1 } : comment
    );
    setComments(updatedComments);
    updateComments(tweet.id, updatedComments);
  };

  const renderResponses = (responses, level = 0) => {
    return responses.map(response => (
      <div key={response.id} className={`ml-${level * 4} mt-2 ml-5`}>
        <div className="flex items-center space-x-4">
          <img src={response.profileImage} alt="Profile" className="h-10 w-10 rounded-full" />
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg w-full border border-gray-400 dark:border-gray-1000">
            <div className="text-gray-900 dark:text-white font-bold">
              {response.user}
              {response.isVerified && <VerifiedBadge />} {/* Afficher le badge si l'utilisateur est vérifié */}
            </div>
            <div className="text-gray-500 dark:text-gray-300">@{response.username}</div>
            <p className="text-gray-700 dark:text-gray-300">{response.content}</p>
            <div className="flex justify-between items-center mt-2">
              <TweetButton Icon={ChatBubbleOvalLeftIcon} label="Comment" onClick={() => { setReplyToCommentId(response.id); setShowReplyInput(true); }} />
              <TweetButton Icon={ArrowsRightLeftIcon} label="Retweet" onClick={() => handleRetweetComment(response.id)} count={response.retweets || 0} />
              <TweetButton Icon={HeartIcon} label="Like" onClick={() => handleLikeComment(response.id)} count={response.likes || 0} />
              <TweetButton Icon={ShareIcon} label="Share" onClick={() => handleShareComment(response.id)} count={response.shares || 0} />
            </div>
          </div>
        </div>
        {response.responses && renderResponses(response.responses, level + 1)}
      </div>
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 border border-gray-400 dark:border-gray-700">
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
      <div className="flex justify-between items-center mt-4">
        <TweetButton Icon={ChatBubbleOvalLeftIcon} label="Comment" onClick={() => setShowCommentInput(true)} count={totalComments} />
        <TweetButton Icon={ArrowsRightLeftIcon} label="Retweet" onClick={() => setRetweets(retweets + 1)} count={retweets} />
        <TweetButton
          Icon={HeartIcon}
          label="Like"
          onClick={handleLike}
          count={likes}
          className={`like-button ${isLiked ? 'liked' : ''}`}
        />
        <TweetButton Icon={ShareIcon} label="Share" onClick={() => setShares(shares + 1)} count={shares} />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Responses ({totalComments})</h3>
        {renderResponses(comments)}
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
        <Modal isOpen={showReplyInput} onClose={() => { setShowReplyInput(false); setReplyToCommentId(null); }}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Reply"
            className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none"
          />
          <button onClick={handleCommentResponse} className="mt-2 p-2 bg-blue-500 text-white rounded-lg">
            Reply
          </button>
        </Modal>
        {showConfirmation && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg">
            Comment added successfully!
          </div>
        )}
        {!showCommentInput && (
          <button onClick={() => setShowCommentInput(true)} className="mt-4 p-2 bg-blue-500 text-white rounded-lg">
            Add Comment
          </button>
        )}
      </div>
    </div>
  );
}

export default TweetDetail;