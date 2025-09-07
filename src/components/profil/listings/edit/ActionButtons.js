import React from 'react';
import { Save, RefreshCw } from 'lucide-react';

/**
 * Komponent przycisków akcji dla formularza edycji
 */
const ActionButtons = ({ saving, onSubmit }) => {
  return (
    <div className="px-6 py-6 bg-gray-50/30 border-t border-gray-200 flex justify-center">
      <button
        type="submit"
        disabled={saving}
        onClick={onSubmit}
        className={`px-8 py-3 rounded-md text-white font-medium text-lg flex items-center justify-center min-w-[200px] ${
          saving ? 'bg-[#4A6B2A]' : 'bg-[#35530A] hover:bg-[#2A4208]'
        } transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1`}
      >
        {saving ? (
          <>
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Zapisywanie...
          </>
        ) : (
          <>
            <Save className="w-5 h-5 mr-2" /> Zapisz zmiany
          </>
        )}
      </button>
    </div>
  );
};

export default ActionButtons;
