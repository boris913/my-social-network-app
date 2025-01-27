import React, { useState } from 'react';
import '../css/SearchBar.css'; // Assurez-vous d'avoir un fichier CSS pour les styles spécifiques

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('tweet');

  const handleSearch = () => {
    onSearch(type, query);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="search-select">
          <option value="tweet">Tweets</option>
          <option value="user">Users</option>
        </select>
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
    </div>
  );
}

export default SearchBar;