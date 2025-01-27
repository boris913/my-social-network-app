import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchResultCard from '../components/SearchResultCard';
import '../css/SearchResultsPage.css'; // Assurez-vous d'avoir un fichier CSS pour les styles spécifiques

function SearchResultsPage({ type, query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/search?type=${type}&query=${query}`);
        setResults(response.data);
      } catch (error) {
        console.error('Error during search:', error);
      }
    };

    fetchResults();
  }, [type, query]);

  return (
    <div className="search-results">
      {results.length === 0 ? (
        <div className="no-results">No results found</div>
      ) : (
        results.map(result => (
          <SearchResultCard key={result.id} result={result} type={type} />
        ))
      )}
    </div>
  );
}

export default SearchResultsPage;