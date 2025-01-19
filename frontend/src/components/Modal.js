import React from 'react';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-400 dark:border-gray-700 w-11/12 max-w-lg">
        <button onClick={onClose} className="text-red-500 float-right">X</button>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;