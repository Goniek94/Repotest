import React from 'react';
import { Grid, List } from 'lucide-react';

const ViewToggle = ({ view, onToggleView }) => {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onToggleView('grid')}
        className={`p-2 rounded-lg border transition-all duration-200 ${
          view === 'grid'
            ? 'bg-green-600 text-white border-green-700'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
        }`}
      >
        <Grid size={20} />
      </button>
      <button
        onClick={() => onToggleView('list')}
        className={`p-2 rounded-lg border transition-all duration-200 ${
          view === 'list'
            ? 'bg-green-600 text-white border-green-700'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
        }`}
      >
        <List size={20} />
      </button>
    </div>
  );
};

export default ViewToggle;