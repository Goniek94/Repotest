import React from "react";
import ListingCard from "./ListingCard";

/**
 * Renders a list of listings.
 * Props:
 * - listings: array of listing objects
 * - onFavorite, onEdit, onDelete, onExtend: function
 * - calculateDaysRemaining: function
 */
const ListingList = ({ listings, onFavorite, onEdit, onDelete, onExtend, calculateDaysRemaining }) => (
  <div className="space-y-6">
    {listings.map((listing) => (
      <ListingCard
        key={listing.id}
        listing={listing}
        onFavorite={onFavorite}
        onEdit={onEdit}
        onDelete={onDelete}
        onExtend={onExtend}
        calculateDaysRemaining={calculateDaysRemaining}
      />
    ))}
  </div>
);

export default ListingList;