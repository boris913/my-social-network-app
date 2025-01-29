import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TweetButton from '../components/TweetButton';
import VerifiedBadge from '../components/VerifiedBadge';
import Modal from '../components/Modal';
import { ChatBubbleOvalLeftIcon, ArrowsRightLeftIcon, HeartIcon, ShareIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import '../css/Tweet.css';

function TweetDetail() {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [retweets, setRetweets] = useState(0);
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [openComments, setOpenComments] = useState({});

  const BASE_URL = 'http://localhost:5000';
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserId = currentUser?.id;

  const fetchLikesComment = useCallback(async (commentId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/likes/comment/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return {
        likes: response.data.length,
        userLikes: response.data,
        isLiked: response.data.some(like => like.userId === currentUserId)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des likes de commentaire:', error);
      return {
        likes: 0,
        userLikes: [],
        isLiked: false
      };
    }
  }, [BASE_URL, currentUserId]);

  const fetchRepliesCount = useCallback(async (commentId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/comments/replies/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.length;
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de réponses:', error);
      return 0;
    }
  }, [BASE_URL]);

  const fetchComments = useCallback(async (tweetId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/comments/${tweetId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const commentsWithDetails = await Promise.all(response.data.map(async (comment) => {
        const { likes, isLiked } = await fetchLikesComment(comment.id);
        const repliesCount = await fetchRepliesCount(comment.id);
        return { ...comment, likes, isLiked, repliesCount };
      }));

      setComments(commentsWithDetails);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
    }
  }, [BASE_URL, fetchLikesComment, fetchRepliesCount]);

  const fetchReplies = useCallback(async (commentId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/comments/replies/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const repliesWithDetails = await Promise.all(response.data.map(async (reply) => {
        const { likes, isLiked } = await fetchLikesComment(reply.id);
        const repliesCount = await fetchRepliesCount(reply.id);
        const nestedReplies = await fetchReplies(reply.id);
        return { ...reply, likes, isLiked, repliesCount, replies: nestedReplies };
      }));

      return repliesWithDetails;
    } catch (error) {
      console.error('Erreur lors de la récupération des réponses:', error);
      return [];
    }
  }, [BASE_URL, fetchLikesComment, fetchRepliesCount]);

  const toggleCommentReplies = async (commentId) => {
    if (openComments[commentId]) {
      setOpenComments(prevState => ({
        ...prevState,
        [commentId]: false
      }));
    } else {
      const nestedReplies = await fetchReplies(commentId);
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, replies: nestedReplies };
        }
        return comment;
      });
      setComments(updatedComments);
      setOpenComments(prevState => ({
        ...prevState,
        [commentId]: true
      }));
    }
  };

  const fetchLikes = useCallback(async (tweetId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/likes/tweet/${tweetId}`);
      setLikes(response.data.length);
      setIsLiked(response.data.some(like => like.userId === currentUserId));
    } catch (error) {
      console.error('Erreur lors de la récupération des likes:', error);
    }
  }, [BASE_URL, currentUserId]);

  const fetchRetweets = useCallback(async (tweetId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/retweets/tweet/${tweetId}`);
      setRetweets(response.data.length);
      setIsRetweeted(response.data.some(retweet => retweet.userId === currentUserId));
    } catch (error) {
      console.error('Erreur lors de la récupération des retweets:', error);
    }
  }, [BASE_URL, currentUserId]);

  const fetchShares = useCallback(async (tweetId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/shares/tweet/${tweetId}`);
      setShares(response.data.length);
      setIsShared(response.data.some(share => share.userId === currentUserId));
    } catch (error) {
      console.error('Erreur lors de la récupération des partages:', error);
    }
  }, [BASE_URL, currentUserId]);

  const fetchTweet = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tweets/${tweetId}`);
      setTweet(response.data);
      setRetweets(response.data.retweets);
      setLikes(response.data.likes);
      setShares(response.data.shares);
      fetchComments(response.data.id);
      fetchLikes(response.data.id);
      fetchRetweets(response.data.id);
      fetchShares(response.data.id);
    } catch (error) {
      console.error('Erreur lors de la récupération du tweet:', error);
    }
  }, [tweetId, BASE_URL, fetchComments, fetchLikes, fetchRetweets, fetchShares]);

  useEffect(() => {
    fetchTweet();
  }, [fetchTweet]);

  const handleAddComment = async () => {
    if (content.trim()) {
      try {
        const response = await axios.post(`${BASE_URL}/api/comments`, {
          content: content,
          tweetId: tweet.id,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const { likes, isLiked } = await fetchLikesComment(response.data.id);
        const repliesCount = await fetchRepliesCount(response.data.id);
        setComments([...comments, { ...response.data, likes, isLiked, repliesCount }]);
        setContent('');
        setShowCommentInput(false);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
      } catch (error) {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
      }
    }
  };

  const handleReplyToComment = async (parentCommentId) => {
    if (replyContent.trim()) {
      try {
        const response = await axios.post(`${BASE_URL}/api/comments/reply`, {
          content: replyContent,
          parentCommentId: parentCommentId
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const addReplyToComment = (comments, parentCommentId, reply) => {
          return comments.map(comment => {
            if (comment.id === parentCommentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), reply],
                repliesCount: comment.repliesCount + 1
              };
            } else if (comment.replies) {
              return {
                ...comment,
                replies: addReplyToComment(comment.replies, parentCommentId, reply)
              };
            }
            return comment;
          });
        };

        const updatedComments = addReplyToComment(comments, parentCommentId, response.data);

        setComments(updatedComments);
        setReplyContent('');
        setShowReplyInput(null);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
      } catch (error) {
        console.error('Erreur lors de la réponse au commentaire:', error);
      }
    }
  };

  const handleLikeCommentRecursive = async (comments, commentId) => {
    for (let comment of comments) {
      if (comment.id === commentId) {
        const { likes, userLikes } = await fetchLikesComment(comment.id);
        const userLike = userLikes.find(like => like.userId === currentUserId);

        if (userLike) {
          await axios.delete(`${BASE_URL}/api/likes/comment/${userLike.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          comment.likes = likes - 1;
          comment.isLiked = false;
        } else {
          await axios.post(`${BASE_URL}/api/likes/comment`, {
            commentId: comment.id,
          }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }});
          comment.likes = likes + 1;
          comment.isLiked = true;
        }
        return true;
      }
      if (comment.replies) {
        const found = await handleLikeCommentRecursive(comment.replies, commentId);
        if (found) return true;
      }
    }
    return false;
  };

  const handleLikeComment = async (commentId) => {
    const updatedComments = [...comments];
    await handleLikeCommentRecursive(updatedComments, commentId);
    setComments(updatedComments);
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        const response = await axios.get(`${BASE_URL}/api/likes/tweet/${tweet.id}`);
        const like = response.data.find(like => like.userId === currentUserId);

        if (like) {
          await axios.delete(`${BASE_URL}/api/likes/${like.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setIsLiked(false);
          setLikes(likes - 1);
          setShowConfirmation(true);
          setTimeout(() => setShowConfirmation(false), 2000);
        }
      } else {
        await axios.post(`${BASE_URL}/api/likes`, {
          tweetId: tweet.id,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setIsLiked(true);
        setLikes(likes + 1);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
      }
    } catch (error) {
      console.error('Erreur lors du like/unlike:', error);
    }
  };

  const handleRetweet = async () => {
    try {
      if (isRetweeted) {
        const response = await axios.get(`${BASE_URL}/api/retweets/tweet/${tweet.id}`);
        const retweet = response.data.find(retweet => retweet.userId === currentUserId);

        if (retweet) {
          await axios.delete(`${BASE_URL}/api/retweets/${retweet.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setIsRetweeted(false);
          setRetweets(retweets - 1);
          setShowConfirmation(true);
          setTimeout(() => setShowConfirmation(false), 2000);
        }
      } else {
        await axios.post(`${BASE_URL}/api/retweets`, {
          tweetId: tweet.id,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setIsRetweeted(true);
        setRetweets(retweets + 1);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
      }
    } catch (error) {
      console.error('Erreur lors du retweet:', error);
    }
  };

  const handleShare = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/shares/tweet/${tweet.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const existingShare = response.data.find(share => share.userId === currentUserId);

      if (existingShare) {
        await axios.delete(`${BASE_URL}/api/shares/${existingShare.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setShares(shares - 1);
        setIsShared(false);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
      } else {
        await axios.post(`${BASE_URL}/api/shares`, {
          tweetId: tweet.id,
          platform: 'twitter'
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setShares(shares + 1);
        setIsShared(true);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  if (!tweet) {
    return <div>Loading...</div>;
  }

  const profilePictureUrl = tweet.User.profile_picture.startsWith('/uploads/')
    ? `${BASE_URL}${tweet.User.profile_picture}`
    : tweet.User.profile_picture;

  const renderComments = (comments, level = 0) => {
    return comments.map(comment => (
      <div key={comment.id} className={`mt-2 ml-${level * 5}`}>
        <div className="flex items-center space-x-4">
          <img
            src={comment.User.profile_picture.startsWith('/uploads/')
              ? `${BASE_URL}${comment.User.profile_picture}`
              : comment.User.profile_picture}
            alt="Profile"
            className="h-10 w-10 rounded-full"
          />
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg w-full border border-gray-400 dark:border-gray-1000">
            <div className="text-gray-900 dark:text-white font-bold">
              {comment.User.username}
              <VerifiedBadge />
            </div>
            <div className="text-gray-500 dark:text-gray-300">@{comment.User.username}</div>
            {comment.parentCommentId === null ? (
              <div className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-3">
                En réponse à <span className="text-blue-500">@{tweet.User?.username}</span>
              </div>
            ) : (
              comment.ParentComment && comment.ParentComment.User && (
                <div className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-3">
                  En réponse à <span className="text-blue-500">@{comment.ParentComment.User.username}</span>
                </div>
              )
            )}
            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
            <div className="flex justify-between items-center mt-4 p-4 border-b border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <TweetButton 
                Icon={ChatBubbleOvalLeftIcon} 
                label="Comment" 
                onClick={() => setShowReplyInput(comment.id)} 
                className=" hover:text-blue-500 transition duration-150"
                count={comment.repliesCount}
              />
              <TweetButton 
                Icon={ArrowsRightLeftIcon} 
                label="Retweet"  
                className=" hover:text-green-500 transition duration-150"
              />
              <TweetButton
                Icon={HeartIcon}
                label="Like"
                onClick={() => handleLikeComment(comment.id)}
                count={comment.likes ?? 0} // Assure que count n'est jamais NaN
                className={`like-button ${comment.isLiked ? 'liked' : ''} hover:text-red-500 transition duration-150`}
              />
              <TweetButton
                Icon={ShareIcon}
                label="Share"
                className=" hover:text-blue-500 transition duration-150"
              />
              <button 
                onClick={() => toggleCommentReplies(comment.id)} 
                className="flex items-center text-gray-600 hover:text-blue-500 transition duration-150"
              >
                {openComments[comment.id] ? (
                  <ChevronUpIcon className="h-6 w-6 mr-1 text-blue-500" style={{ strokeWidth: 4 }} />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 mr-1 text-blue-500" style={{ strokeWidth: 4 }}/>
                )}
              </button>
            </div>
            {showReplyInput === comment.id && (
              <div className="reply-input mt-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Écrire une réponse..."
                  className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none"
                />
                <button onClick={() => handleReplyToComment(comment.id)} className="mt-2 p-2 bg-blue-500 text-white rounded-lg">
                  Répondre
                </button>
              </div>
            )}
            {openComments[comment.id] && comment.replies && comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 border border-gray-400 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <img src={profilePictureUrl} alt="Profile" className="h-12 w-12 rounded-full" />
        <div>
          <div className="text-gray-900 dark:text-white font-bold">
            {tweet.User.username}
            <VerifiedBadge />
          </div>
          <div className="text-gray-500 dark:text-gray-400">@{tweet.User.username}</div>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mt-2">{tweet.content}</p>
      <div className="flex justify-between items-center mt-4">
        <TweetButton Icon={ChatBubbleOvalLeftIcon} label="Comment" onClick={() => setShowCommentInput(true)} count={comments.length} />
        <TweetButton Icon={ArrowsRightLeftIcon} label="Retweet" onClick={handleRetweet} count={retweets} className={`retweet-button ${isRetweeted ? 'retweeted' : ''}`} />
        <TweetButton
          Icon={HeartIcon}
          label="Like"
          onClick={handleLike}
          count={likes}
          className={`like-button ${isLiked ? 'liked' : ''}`}
        />
        <TweetButton
          Icon={ShareIcon}
          label="Share"
          onClick={handleShare}
          count={shares}
          className={`share-button ${isShared ? 'shared' : ''}`}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Réponses ({comments.length})</h3>
        {renderComments(comments)}
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
            Action effectuée avec succès !
          </div>
        )}
      </div>
    </div>
  );
}

export default TweetDetail;