import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CollapsibleSection = ({ 
  title, 
  children, 
  defaultOpen = false, 
  className = "",
  titleClassName = "",
  contentClassName = ""
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`bg-white shadow-md rounded-sm overflow-hidden ${className}`}>
      <button
        onClick={toggleSection}
        className={`w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors ${titleClassName}`}
      >
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? (
            <ChevronUp className="w-6 h-6 text-gray-600" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-600" />
          )}
        </div>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`px-6 pb-6 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
