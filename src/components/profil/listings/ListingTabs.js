import React from "react";
import { Heart } from "lucide-react";

/**
 * Tabs for switching between listing categories.
 * Props:
 * - activeTab: string
 * - setActiveTab: function
 */
const ListingTabs = ({ activeTab, setActiveTab }) => (
  <div className="mb-8 bg-gray-50 p-4 rounded-sm border border-gray-100">
    <div className="flex">
      <button
        onClick={() => setActiveTab("active")}
        className={`py-3 px-6 mr-4 font-medium text-base rounded-sm transition-colors ${
          activeTab === "active"
            ? "bg-[#35530A] text-white"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
        }`}
      >
        Aktywne
      </button>
      <button
        onClick={() => setActiveTab("completed")}
        className={`py-3 px-6 mr-4 font-medium text-base rounded-sm transition-colors ${
          activeTab === "completed"
            ? "bg-[#35530A] text-white"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
        }`}
      >
        Zakończone
      </button>
      <button
        onClick={() => setActiveTab("favorites")}
        className={`py-3 px-6 font-medium text-base rounded-sm transition-colors flex items-center ${
          activeTab === "favorites"
            ? "bg-[#35530A] text-white"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
        }`}
      >
        <Heart className="w-5 h-5 mr-2" /> Ulubione
      </button>
    </div>
  </div>
);

export default ListingTabs;