// FilterTags.js
import React, { useState } from 'react';

/**
 * Komponent wyświetlający filtry w formie tagów/klikanych elementów
 * @param {object} props
 * @param {object} props.formData - dane formularza
 * @param {function} props.handleTagSelect - funkcja do obsługi wyboru tagu
 * @param {object} props.filterGroups - grupy filtrów do wyświetlenia
 * @returns {JSX.Element}
 */
const FilterTags = ({ formData, handleTagSelect, filterGroups }) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const isTagSelected = (groupId, value) => {
    if (!formData[groupId]) return false;
    
    if (Array.isArray(formData[groupId])) {
      return formData[groupId].includes(value);
    }
    
    return formData[groupId] === value;
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {Object.entries(filterGroups).map(([groupId, group]) => (
        <div key={groupId} className="filter-group">
          <button
            type="button"
            onClick={() => toggleGroup(groupId)}
            className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            <span className="font-medium text-sm">{group.label}</span>
            <span className="ml-2">{expandedGroups[groupId] ? '▲' : '▼'}</span>
          </button>
          
          {expandedGroups[groupId] && (
            <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-64 max-h-60 overflow-y-auto">
              <div className="flex flex-wrap gap-1">
                {group.options.map((option) => (
                  <button
                    key={`${groupId}-${option.value}`}
                    type="button"
                    onClick={() => handleTagSelect(groupId, option.value)}
                    className={`px-2 py-1 rounded-full text-xs border ${
                      isTagSelected(groupId, option.value)
                        ? 'bg-[#35530A] text-white border-[#35530A]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              {group.customInput && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    {group.customInput.type === 'range' && (
                      <>
                        <input
                          type="number"
                          name={`${group.customInput.fromName}`}
                          placeholder="Od"
                          value={formData[group.customInput.fromName] || ''}
                          onChange={group.customInput.onChange}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          name={`${group.customInput.toName}`}
                          placeholder="Do"
                          value={formData[group.customInput.toName] || ''}
                          onChange={group.customInput.onChange}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterTags;