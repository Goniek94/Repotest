// SearchFormButtons.js
import React from "react";

/**
 * SearchFormButtons component
 * @param {object} props
 * @returns {JSX.Element}
 */
export default function SearchFormButtons({
  showAdvanced,
  setShowAdvanced,
  handleSearch,
  matchingResults,
}) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-4">
      {/* Przycisk / link „Zaawansowane" */}
      <button
        type="button"
        className="text-[#35530A] text-sm uppercase font-semibold
                   border border-transparent hover:border-[#35530A]
                   hover:bg-white hover:underline
                   px-2 py-1 transition-colors rounded-[2px]"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? "Ukryj zaawansowane" : "Zaawansowane ▼"}
      </button>

      {/* Główny przycisk – Pokaż ogłoszenia */}
      <button
        type="button"
        onClick={handleSearch}
        className="bg-[#35530A] text-white rounded-[2px] px-6 py-2
                   text-sm font-bold uppercase hover:bg-[#2D4A06]
                   transition-colors"
      >
        Pokaż ogłoszenia
        <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-[2px]">
          ({matchingResults})
        </span>
      </button>
    </div>
  );
}
