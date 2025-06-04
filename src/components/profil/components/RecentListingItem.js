import React from "react";

/**
 * Uproszczony komponent dla wyświetlania ID ogłoszenia
 * Props:
 * - title: string (ID ogłoszenia do wyświetlenia)
 * - href: string (link do szczegółów ogłoszenia)
 * - color: string (kolor akcentu, opcjonalny)
 */
const RecentListingItem = ({ 
  title,
  href, 
  color = "#35530A" 
}) => (
  <div
    className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 p-2 sm:p-3"
    style={{ borderRadius: "2px" }}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center shrink-0 mr-2 sm:mr-3">
          <span className="text-xs font-medium text-gray-600">#</span>
        </div>
        <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{title}</h4>
      </div>
      <a 
        href={href} 
        className="text-xs sm:text-sm font-medium flex items-center ml-2 sm:ml-4" 
        style={{ color }}
        onClick={(e) => {
          e.preventDefault(); // Zapobiegaj domyślnej akcji przeglądarki
          window.location.href = href; // Użyj window.location.href dla pełnego przekierowania
        }}
      >
        Zobacz <span className="ml-1">→</span>
      </a>
    </div>
  </div>
);

export default RecentListingItem;
