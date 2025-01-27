import React from 'react';
import axios from 'axios';

function DeleteTweet({ tweetId, onDelete }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/tweets/${tweetId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Tweet supprimé avec succès');
      onDelete(tweetId); // Appel de la fonction onDelete pour mettre à jour l'interface utilisateur
    } catch (error) {
      console.error('Erreur lors de la suppression du tweet:', error);
      alert('Erreur lors de la suppression du tweet.');
    }
  };

  return (
    <button onClick={handleDelete}>Supprimer</button>
  );
}

export default DeleteTweet;