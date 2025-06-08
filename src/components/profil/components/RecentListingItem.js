import React from "react";

/**
 * Uproszczony komponent dla wyświetlania ogłoszenia
 * Props:
 * - title: string - nazwa ogłoszenia
 * - href: string - link do szczegółów ogłoszenia
 * - image: string - miniaturka ogłoszenia
 * - price: number - cena ogłoszenia
 * - color: string - kolor akcentu (opcjonalny)
 */
const RecentListingItem = ({
  title,
  href,
  image,
  price,
  color = "#35530A"
}) => (
  <div
    className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 p-2 sm:p-3"
    style={{ borderRadius: "2px" }}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-sm overflow-hidden flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/auto-788747_1280.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Brak zdjęcia</div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{title}</h4>
          {price !== undefined && (
            <p className="text-xs text-gray-600">{price.toLocaleString('pl-PL')} zł</p>
          )}
        </div>
      </div>
      <a
        href={href}
        className="text-xs sm:text-sm font-medium flex items-center ml-2 sm:ml-4"
        style={{ color }}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = href;
        }}
      >
        Zobacz <span className="ml-1">→</span>
      </a>
    </div>
  </div>
);

export default RecentListingItem;
