import React from 'react';

const Modal = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-800 bg-opacity-50 w-full h-full absolute"></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10">
        <h2 className="text-lg font-semibold text-gray-800">{message}</h2>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;