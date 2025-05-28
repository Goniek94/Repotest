import React from "react";

/**
 * Card for a single recently viewed listing.
 * Props:
 * - title: string
 * - description: string
 * - price: string
 * - href: string
 * - imageLabel: string (e.g. "Auto")
 * - color: string (for accent, optional)
 */
const RecentListingItem = ({ title, description, price, href, imageLabel = "Auto", color = "#35530A" }) => (
  <div
    className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
    style={{ borderRadius: "2px" }}
  >
    <div className="flex">
      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center shrink-0">
        <div className="w-full h-full flex items-center justify-center text-gray-600">{imageLabel}</div>
      </div>
      <div className="flex-grow p-3 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between">
            <h4 className="font-bold text-gray-800">{title}</h4>
          </div>
          <p className="text-xs text-gray-600 truncate">{description}</p>
        </div>
      </div>
      <div
        className="p-3 flex flex-col items-end justify-between bg-gray-50 shrink-0"
        style={{ borderRadius: "0 2px 2px 0" }}
      >
        <span className="text-sm font-medium whitespace-nowrap">{price}</span>
        <a href={href} className="text-sm font-medium flex items-center" style={{ color }}>
          Zobacz <span className="ml-1">→</span>
        </a>
      </div>
    </div>
  </div>
);

export default RecentListingItem;