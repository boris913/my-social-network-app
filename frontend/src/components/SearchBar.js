import React from 'react';

function SearchBar() {
  return (
    <div className="p-4 border border-gray-400 dark:border-gray-1000">
      <input
        type="text"
        placeholder="Search Twitter"
        className="w-full p-2 rounded-full bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none"
      />
    </div>
  );
}

export default SearchBar;
