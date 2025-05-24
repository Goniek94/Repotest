import React from "react";

/**
 * SellerInfo component displays the seller's name and the listing creation date.
 * @param {Object} props
 * @param {Object} props.listing - Listing object containing ownerName and createdAt.
 */
const SellerInfo = ({ listing }) => {
  if (!listing) return null;

  // Format date to Polish locale
  const formatDate = (dateString) => {
    if (!dateString) return "Nieznana data";
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mb-4">
      <div className="text-gray-700 text-base">
        <span className="font-semibold">Sprzedający:</span>{" "}
        {listing.ownerName || "Nieznane imię"}
      </div>
      <div className="text-gray-700 text-base">
        <span className="font-semibold">Dodano:</span>{" "}
        {formatDate(listing.createdAt)}
      </div>
    </div>
  );
};

export default SellerInfo;
