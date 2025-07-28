import React from 'react';

// Ulepszone loading spinner z lepszą animacją i UX
const LoadingSpinner = ({ message = "Ładowanie...", size = "large" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12", 
    large: "w-16 h-16"
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* Spinner z lepszą animacją */}
        <div className={`${sizeClasses[size]} border-4 border-t-[#35530A] border-r-[#35530A]/30 border-b-[#35530A]/30 border-l-[#35530A]/30 rounded-full animate-spin mx-auto`}></div>
        
        {/* Message z fade-in animacją */}
        <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
        
        {/* Progress dots */}
        <div className="flex justify-center mt-2 space-x-1">
          <div className="w-2 h-2 bg-[#35530A] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#35530A] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-[#35530A] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
