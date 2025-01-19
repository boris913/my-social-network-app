import React from 'react';

function TweetButton({ Icon, label, onClick, count, className }) {
  return (
    <button onClick={onClick} className={`flex items-center space-x-1 ${className} text-gray-500 hover:text-blue-500 dark:hover:text-blue-400`}>
      <Icon className="h-5 w-5" />
      <span>{label}</span>
      {count !== undefined && <span>{count}</span>}
    </button>
  );
}

export default TweetButton;