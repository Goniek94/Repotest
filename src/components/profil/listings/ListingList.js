import React from "react";
import ListingCard from "./ListingCard";

/**
 * Renders a list of listings.
 * Props:
 * - listings: array of listing objects
 * - onFavorite, onEdit, onDelete: function
 * - calculateDaysRemaining: function
 */
const ListingList = ({ listings, onFavorite, onEdit, onDelete, calculateDaysRemaining }) => (
  <div className="space-y-6">
    {listings.map((listing) => (
      <ListingCard
        key={listing.id}
        listing={listing}
        onFavorite={onFavorite}
        onEdit={onEdit}
        onDelete={onDelete}
        calculateDaysRemaining={calculateDaysRemaining}
      />
    ))}
  </div>
);

export default ListingList;
