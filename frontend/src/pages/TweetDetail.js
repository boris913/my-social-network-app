import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TweetButton from '../components/TweetButton';
import VerifiedBadge from '../components/VerifiedBadge';
import Modal from '../components/Modal';
import { ChatBubbleOvalLeftIcon, ArrowsRightLeftIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import '../css/Tweet.css';

function TweetDetail() {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [retweets, setRetweets] = useState(0);
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // Base URL du serveur backend
  const BASE_URL = 'http://localhost:5000';
  const currentUser = JSON.parse(localStorage.getItem('user')); // Assumons que l'utilisateur est stocké dans le localStorage
  const currentUserId = currentUser?.id;

  const fetchComments = async (tweetId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/comments/${tweetId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setComments(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
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
  }, [tweetId, BASE_URL, fetchLikes, fetchRetweets, fetchShares]);

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

        setComments([...comments, response.data]);
        setContent('');
        setShowCommentInput(false);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
      } catch (error) {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
      }
    }
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

  // Construction de l'URL complète pour la photo de profil
  const profilePictureUrl = tweet.User.profile_picture.startsWith('/uploads/')
    ? `${BASE_URL}${tweet.User.profile_picture}`
    : tweet.User.profile_picture;

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
        <TweetButton Icon={ShareIcon} label="Share" onClick={handleShare} count={shares} className={`share-button ${isShared ? 'shared' : ''}`} />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Réponses ({comments.length})</h3>
        {comments.map(comment => (
          <div key={comment.id} className="mt-2 ml-5">
            <div className="flex items-center space-x-4">
              <img src={comment.User.profile_picture.startsWith('/uploads/')
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
                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
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





// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import TweetButton from '../components/TweetButton';
// import VerifiedBadge from '../components/VerifiedBadge';
// import Modal from '../components/Modal';
// import { ChatBubbleOvalLeftIcon, ArrowsRightLeftIcon, HeartIcon, ShareIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import additional icons
// import axios from 'axios';
// import '../css/Tweet.css';

// function TweetDetail({ tweets, updateComments, updateLikes }) {
//   const { tweetId } = useParams();
//   const tweet = tweets.find(t => t.id === parseInt(tweetId));
//   const [user, setUser] = useState(null); // State to hold user information

//   const [comments, setComments] = useState([]);
//   const [likes, setLikes] = useState(tweet ? tweet.likes ?? 0 : 0);
//   const [retweets, setRetweets] = useState(tweet ? tweet.retweets ?? 0 : 0);
//   const [shares, setShares] = useState(tweet ? tweet.shares ?? 0 : 0);
//   const [content, setContent] = useState('');
//   const [showCommentInput, setShowCommentInput] = useState(false);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);

//   const [replyContent, setReplyContent] = useState('');
//   const [showReplyInput, setShowReplyInput] = useState(false);
//   const [replyToCommentId, setReplyToCommentId] = useState(null);

//   const [editCommentId, setEditCommentId] = useState(null);
//   const [editContent, setEditContent] = useState('');

//   useEffect(() => {
//     if (tweet) {
//       fetchComments(tweet.id);
//       setLikes(tweet.likes ?? 0);
//       setRetweets(tweet.retweets ?? 0);
//       setShares(tweet.shares ?? 0);
//     }
//     fetchUser(); // Fetch user information when component mounts
//   }, [tweet]);

//   const fetchUser = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/user', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       setUser(response.data);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des informations utilisateur:', error);
//     }
//   };

//   const fetchComments = async (tweetId) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/comments/${tweetId}`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       setComments(response.data);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des commentaires:', error);
//     }
//   };

//   const handleAddComment = async () => {
//     if (content.trim()) {
//       try {
//         const response = await axios.post(`http://localhost:5000/api/comments`, {
//           content: content,
//           tweetId: tweet.id,
//         }, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });

//         setComments([...comments, response.data]);
//         setContent('');
//         setShowCommentInput(false);
//         setShowConfirmation(true);
//         setTimeout(() => setShowConfirmation(false), 2000);
//       } catch (error) {
//         console.error('Erreur lors de l\'ajout du commentaire:', error);
//       }
//     }
//   };

//   const handleUpdateComment = async (commentId) => {
//     try {
//       const response = await axios.put(`http://localhost:5000/api/comments/${commentId}`, {
//         content: editContent
//       }, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       setComments(comments.map(comment => comment.id === commentId ? response.data : comment));
//       setEditCommentId(null);
//       setEditContent('');
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour du commentaire:', error);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       setComments(comments.filter(comment => comment.id !== commentId));
//     } catch (error) {
//       console.error('Erreur lors de la suppression du commentaire:', error);
//     }
//   };

//   const handleCommentResponse = () => {
//     if (replyContent.trim() && replyToCommentId !== null) {
//       const updatedComments = comments.map(comment =>
//         comment.id === replyToCommentId
//           ? {
//               ...comment,
//               responses: [
//                 ...(comment.responses || []),
//                 {
//                   id: (comment.responses ? comment.responses.length : 0) + 1,
//                   user: user.username, // Use dynamic user information
//                   username: user.username,
//                   content: replyContent,
//                   profileImage: user.profile_picture, // Use dynamic user profile picture
//                   responses: [],
//                   likes: 0,
//                   retweets: 0,
//                   shares: 0,
//                 },
//               ],
//             }
//           : comment
//       );
//       setComments(updatedComments);
//       updateComments(tweet.id, updatedComments);
//       setReplyContent('');
//       setShowReplyInput(false);
//       setReplyToCommentId(null);
//     }
//   };

//   const handleLike = (event) => {
//     event.preventDefault();
//     const newLikes = isLiked ? likes - 1 : likes + 1;
//     setIsLiked(!isLiked);
//     setLikes(newLikes);
//     updateLikes(tweet.id, newLikes);
//   };

//   const handleLikeComment = (commentId) => {
//     const updatedComments = comments.map(comment =>
//       comment.id === commentId ? { ...comment, likes: (comment.likes || 0) + 1 } : comment
//     );
//     setComments(updatedComments);
//     updateComments(tweet.id, updatedComments);
//   };

//   const handleRetweetComment = (commentId) => {
//     const updatedComments = comments.map(comment =>
//       comment.id === commentId ? { ...comment, retweets: (comment.retweets || 0) + 1 } : comment
//     );
//     setComments(updatedComments);
//     updateComments(tweet.id, updatedComments);
//   };

//   const handleShareComment = (commentId) => {
//     const updatedComments = comments.map(comment =>
//       comment.id === commentId ? { ...comment, shares: (comment.shares || 0) + 1 } : comment
//     );
//     setComments(updatedComments);
//     updateComments(tweet.id, updatedComments);
//   };

//   const renderResponses = (responses, level = 0) => {
//     return responses.map(response => (
//       <div key={response.id} className={`ml-${level * 4} mt-2 ml-5`}>
//         <div className="flex items-center space-x-4">
//           <img src={response.profileImage} alt="Profile" className="h-10 w-10 rounded-full" />
//           <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg w-full border border-gray-400 dark:border-gray-1000">
//             <div className="text-gray-900 dark:text-white font-bold">
//               {response.user}
//               {response.isVerified && <VerifiedBadge />}
//             </div>
//             <div className="text-gray-500 dark:text-gray-300">@{response.username}</div>
//             <p className="text-gray-700 dark:text-gray-300">{response.content}</p>
//             <div className="flex justify-between items-center mt-2">
//               <TweetButton Icon={ChatBubbleOvalLeftIcon} label="Comment" onClick={() => { setReplyToCommentId(response.id); setShowReplyInput(true); }} />
//               <TweetButton Icon={ArrowsRightLeftIcon} label="Retweet" onClick={() => handleRetweetComment(response.id)} count={response.retweets || 0} />
//               <TweetButton Icon={HeartIcon} label="Like" onClick={() => handleLikeComment(response.id)} count={response.likes || 0} />
//               <TweetButton Icon={ShareIcon} label="Share" onClick={() => handleShareComment(response.id)} count={response.shares || 0} />
//               <TweetButton Icon={PencilIcon} label="Edit" onClick={() => { setEditCommentId(response.id); setEditContent(response.content); }} />
//               <TweetButton Icon={TrashIcon} label="Delete" onClick={() => handleDeleteComment(response.id)} />
//             </div>
//             {editCommentId === response.id && (
//               <div className="mt-2">
//                 <textarea
//                   value={editContent}
//                   onChange={(e) => setEditContent(e.target.value)}
//                   className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none"
//                 />
//                 <button onClick={() => handleUpdateComment(response.id)} className="mt-2 p-2 bg-blue-500 text-white rounded-lg">
//                   Update
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//         {response.responses && renderResponses(response.responses, level + 1)}
//       </div>
//     ));
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 border border-gray-400 dark:border-gray-700">
//       <div className="flex items-center space-x-4">
//         <img src={tweet.profileImage} alt="Profile" className="h-12 w-12 rounded-full" />
//         <div>
//           <div className="text-gray-900 dark:text-white font-bold">
//             {tweet.user}
//             {tweet.isVerified && <VerifiedBadge />} {/* Afficher le badge si l'utilisateur est vérifié */}
//           </div>
//           <div className="text-gray-500 dark:text-gray-400">@{tweet.username}</div>
//         </div>
//       </div>
//       <p className="text-gray-700 dark:text-gray-300 mt-2">{tweet.content}</p>
//       <div className="flex justify-between items-center mt-4">
//         <TweetButton Icon={ChatBubbleOvalLeftIcon} label="Comment" onClick={() => setShowCommentInput(true)} count={comments.length} />
//         <TweetButton Icon={ArrowsRightLeftIcon} label="Retweet" onClick={() => setRetweets(retweets + 1)} count={retweets} />
//         <TweetButton
//           Icon={HeartIcon}
//           label="Like"
//           onClick={handleLike}
//           count={likes}
//           className={`like-button ${isLiked ? 'liked' : ''}`}
//         />
//         <TweetButton Icon={ShareIcon} label="Share" onClick={() => setShares(shares + 1)} count={shares} />
//       </div>
//       <div className="mt-4">
//         <h3 className="text-lg font-bold text-gray-900 dark:text-white">Responses ({comments.length})</h3>
//         {renderResponses(comments)}
//         <Modal isOpen={showCommentInput} onClose={() => setShowCommentInput(false)}>
//           <textarea
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Comment"
//             className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none"
//           />
//           <button onClick={handleAddComment} className="mt-2 p-2 bg-blue-500 text-white rounded-lg">
//             Comment
//           </button>
//         </Modal>
//         <Modal isOpen={showReplyInput} onClose={() => { setShowReplyInput(false); setReplyToCommentId(null); }}>
//           <textarea
//             value={replyContent}
//             onChange={(e) => setReplyContent(e.target.value)}
//             placeholder="Reply"
//             className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none"
//           />
//           <button onClick={handleCommentResponse} className="mt-2 p-2 bg-blue-500 text-white rounded-lg">
//             Reply
//           </button>
//         </Modal>
//         {showConfirmation && (
//           <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg">
//             Comment added successfully!
//           </div>
//         )}
//         {!showCommentInput && (
//           <button onClick={() => setShowCommentInput(true)} className="mt-4 p-2 bg-blue-500 text-white rounded-lg">
//             Add Comment
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default TweetDetail;