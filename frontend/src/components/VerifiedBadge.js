import React from 'react';

function VerifiedBadge() {
  return (
    <svg
      className="w-5 h-5 text-blue-600 inline-block ml-1"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#1DA1F2" /> {/* Cercle de fond bleu */}
      <path
        d="M9.5 16.5l-3-3 1.5-1.5 1.5 1.5 4.5-4.5 1.5 1.5-6 6z"
        fill="white" // Couleur blanche pour la coche
      />
    </svg>
  );
}

export default VerifiedBadge;