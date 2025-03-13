import React from 'react';
import { FaTh, FaThList } from 'react-icons/fa';

const ViewToggle = ({ view, onToggleView }) => {
  return (
    <div className="hidden sm:flex space-x-2">
      <button
        onClick={() => onToggleView('list')}
        className={`p-2.5 border rounded-[2px] transition-all duration-200 ${
          view === 'list'
            ? 'bg-[#35530A] text-white border-[#35530A]'
            : 'border-gray-300 text-gray-600 hover:border-[#35530A] hover:text-[#35530A]'
        }`}
      >
        <FaThList size={20} />
      </button>
      <button
        onClick={() => onToggleView('grid')}
        className={`p-2.5 border rounded-[2px] transition-all duration-200 ${
          view === 'grid'
            ? 'bg-[#35530A] text-white border-[#35530A]'
            : 'border-gray-300 text-gray-600 hover:border-[#35530A] hover:text-[#35530A]'
        }`}
      >
        <FaTh size={20} />
      </button>
    </div>
  );
};

export default ViewToggle;