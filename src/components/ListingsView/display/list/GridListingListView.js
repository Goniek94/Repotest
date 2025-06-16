import React from "react";
import ListingCard from "../grid/ListingCard";

/**
 * GridListingListView - wyświetla ogłoszenia jako karty w siatce
 * @param {object} props
 * @param {Array} props.listings
 * @param {function} props.onNavigate
 * @param {function} props.onFavorite
 * @param {Array} props.favorites
 * @param {object} props.favMessages
 */
const GridListingListView = ({
  listings,
  onNavigate,
  onFavorite,
  favorites,
  favMessages = {},
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {listings.map((listing) => {
        const isFavorite = favorites.includes(listing.id || listing._id);
        
        return (
          <div key={listing.id || listing._id} className="relative">
            <ListingCard
              listing={listing}
              onNavigate={() => onNavigate(listing.id || listing._id)}
              onFavorite={() => onFavorite(listing.id || listing._id)}
              isFavorite={isFavorite}
              message={favMessages[listing.id || listing._id]}
            />
            
            {/* Komunikat o ulubionych */}
            {favMessages[listing.id || listing._id] && (
              <div className="absolute top-3 right-16 bg-black bg-opacity-75 text-white text-sm px-3 py-1.5 rounded-[2px] z-20">
                {favMessages[listing.id || listing._id]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GridListingListView;
