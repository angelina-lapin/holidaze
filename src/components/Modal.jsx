import React from 'react';

export default function Modal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold text-accent mb-3">{title}</h2>
        <p className="text-sm text-gray-700 mb-5">{message}</p>
        <button
          onClick={onClose}
          className="bg-accent hover:bg-opacity-80 text-white py-2 px-4 rounded w-full transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
