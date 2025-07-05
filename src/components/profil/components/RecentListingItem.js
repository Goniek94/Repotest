import React from "react";
import { useNavigate } from "react-router-dom";
import getImageUrl from "../../../utils/responsive/getImageUrl";

/**
 * Uproszczony komponent dla wyświetlania ogłoszenia
 * Props:
 * - title: string - nazwa ogłoszenia
 * - href: string - link do szczegółów ogłoszenia
 * - image: string - miniaturka ogłoszenia
 * - price: number - cena ogłoszenia
 * - color: string - kolor akcentu (opcjonalny)
 */
const RecentListingItem = ({ title, href, image, price, color = "#35530A" }) => {
  const navigate = useNavigate();

  const goToListing = () => navigate(href);

  return (
    <div
      className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 p-2 sm:p-3 cursor-pointer rounded-md"
      onClick={goToListing}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
            {image ? (
              <img
                src={getImageUrl(image)}
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
            <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">{title}</h4>
            {price !== undefined && (
              <p className="text-xs sm:text-sm font-medium text-green-800">{price.toLocaleString('pl-PL')} zł</p>
            )}
          </div>
        </div>
        <a
          href={href}
          className="text-xs sm:text-sm font-medium flex items-center ml-2 sm:ml-4"
          style={{ color }}
          onClick={(e) => {
            e.preventDefault();
            goToListing();
          }}
        >
          Zobacz <span className="ml-1">→</span>
        </a>
      </div>
    </div>
  );
};

export default RecentListingItem;
