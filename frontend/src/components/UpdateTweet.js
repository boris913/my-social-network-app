import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateTweet({ tweetId }) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tweets/${tweetId}`);
        setContent(response.data.content);
        setImageUrl(response.data.imageUrl);
        setVideoUrl(response.data.videoUrl);
      } catch (error) {
        console.error('Erreur lors de la récupération du tweet:', error);
      }
    };

    fetchTweet();
  }, [tweetId]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/tweets/${tweetId}`, {
        content,
        imageUrl,
        videoUrl,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Tweet mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du tweet:', error);
      alert('Erreur lors de la mise à jour du tweet.');
    }
  };

  return (
    <div>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" />
      <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Video URL" />
      <button onClick={handleUpdate}>Mettre à jour</button>
    </div>
  );
}

export default UpdateTweet;