import React from 'react';
import ListingListItem from './ListingListItem';

const ListingListView = ({ 
  listings, 
  onNavigate, 
  onFavorite, 
  favorites, 
  favMessages 
}) => {
  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <ListingListItem
          key={listing.id}
          listing={listing}
          onNavigate={onNavigate}
          onFavorite={onFavorite}
          isFavorite={favorites.includes(listing.id)}
          message={favMessages[listing.id]}
        />
      ))}
    </div>
  );
};

export default ListingListView;