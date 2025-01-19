import React from 'react';
import trendsData from '../data/trends.json'; // Assurez-vous que le chemin est correct

function Trends() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-4 border border-gray-400 dark:border-gray-1000">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Trends</h2>
      {/* Liste des tendances */}
      <div className="space-y-2">
        {trendsData.map(trend => (
          <div key={trend.id} className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">{trend.trend}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trends;