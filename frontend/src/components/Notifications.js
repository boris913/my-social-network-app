import React from 'react';

function Notifications() {
  const notifications = [
    { id: 1, message: 'John Doe liked your tweet' },
    { id: 2, message: 'Jane Smith followed you' },
    // Ajoutez plus de notifications ici
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 border border-gray-400 dark:border-gray-1000">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Notifications</h2>
      <div className="space-y-2">
        {notifications.map(notification => (
          <div key={notification.id} className="p-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300">{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
