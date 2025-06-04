import React from "react";
import { Heart, FileText } from "lucide-react";

/**
 * Tabs for switching between listing categories.
 * Props:
 * - activeTab: string
 * - setActiveTab: function
 * - counts: object with counts for each category (optional)
 */
const ListingTabs = ({ activeTab, setActiveTab, counts = {} }) => (
  <div className="mb-6 bg-white p-3 sm:p-4 rounded-sm border border-green-100 shadow-sm">
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setActiveTab("active")}
        className={`py-2 sm:py-3 px-3 sm:px-6 font-medium text-sm sm:text-base rounded-sm transition-colors ${
          activeTab === "active"
            ? "bg-[#35530A] text-white"
            : "bg-white text-gray-700 border border-green-200 hover:bg-green-50"
        }`}
      >
        Aktywne {counts.active > 0 && `(${counts.active})`}
      </button>
      <button
        onClick={() => setActiveTab("drafts")}
        className={`py-2 sm:py-3 px-3 sm:px-6 font-medium text-sm sm:text-base rounded-sm transition-colors flex items-center ${
          activeTab === "drafts"
            ? "bg-[#35530A] text-white"
            : "bg-white text-gray-700 border border-green-200 hover:bg-green-50"
        }`}
      >
        <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> 
        Wersje robocze {counts.drafts > 0 && `(${counts.drafts})`}
      </button>
      <button
        onClick={() => setActiveTab("completed")}
        className={`py-2 sm:py-3 px-3 sm:px-6 font-medium text-sm sm:text-base rounded-sm transition-colors ${
          activeTab === "completed"
            ? "bg-[#35530A] text-white"
            : "bg-white text-gray-700 border border-green-200 hover:bg-green-50"
        }`}
      >
        Zakończone {counts.completed > 0 && `(${counts.completed})`}
      </button>
      <button
        onClick={() => setActiveTab("favorites")}
        className={`py-2 sm:py-3 px-3 sm:px-6 font-medium text-sm sm:text-base rounded-sm transition-colors flex items-center ${
          activeTab === "favorites"
            ? "bg-[#35530A] text-white"
            : "bg-white text-gray-700 border border-green-200 hover:bg-green-50"
        }`}
      >
        <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> 
        Ulubione {counts.favorites > 0 && `(${counts.favorites})`}
      </button>
    </div>
  </div>
);

export default ListingTabs;