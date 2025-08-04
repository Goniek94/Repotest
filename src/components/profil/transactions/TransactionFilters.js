import React from "react";
import { Search, Calendar, Filter } from "lucide-react";

/**
 * Filters and search bar for transaction history.
 * Props:
 * - searchTerm: string
 * - setSearchTerm: function
 * - dateFilter: string
 * - setDateFilter: function
 * - startDate: string
 * - setStartDate: function
 * - endDate: string
 * - setEndDate: function
 * - onCustomDateFilter: function
 * - onDateFilterChange: function
 * - primaryColor: string
 */
const TransactionFilters = ({
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onCustomDateFilter,
  onDateFilterChange,
  primaryColor = "#35530A",
}) => (
  <>
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Wyszukaj transakcję..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <select
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            onDateFilterChange(e.target.value);
          }}
        >
          <option value="wszystkie">Wszystkie transakcje</option>
          <option value="dzisiaj">Dzisiaj</option>
          <option value="tydzien">Ostatni tydzień</option>
          <option value="miesiac">Ostatni miesiąc</option>
          <option value="rok">Ostatni rok</option>
          <option value="zakres">Niestandardowy okres</option>
        </select>
        <button
          className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200"
          style={{ backgroundColor: "rgba(53, 83, 10, 0.1)", color: primaryColor }}
        >
          <Filter size={18} />
          <span>Filtruj</span>
        </button>
      </div>
    </div>
    {dateFilter === "zakres" && (
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar size={18} className="text-gray-400" />
          </div>
          <input
            type="date"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar size={18} className="text-gray-400" />
          </div>
          <input
            type="date"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          style={{ backgroundColor: primaryColor }}
          onClick={() => onCustomDateFilter(startDate, endDate)}
        >
          Zastosuj
        </button>
      </div>
    )}
  </>
);

export default TransactionFilters;
