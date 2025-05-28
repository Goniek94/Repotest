import React from "react";

/**
 * Renders the transaction table.
 * Props:
 * - transactions: array of transaction objects
 * - onSort: function (column key)
 * - sortConfig: { key: string, direction: 'asc' | 'desc' }
 * - primaryColor: string
 */
const TransactionTable = ({ transactions, onSort, sortConfig, primaryColor = "#35530A" }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-300">
          <th
            className="py-2 px-4 text-left w-24 cursor-pointer hover:bg-gray-50"
            onClick={() => onSort("date")}
            style={{ color: primaryColor }}
          >
            DATA
          </th>
          <th
            className="py-2 px-4 text-left cursor-pointer hover:bg-gray-50"
            onClick={() => onSort("description")}
            style={{ color: primaryColor }}
          >
            OPIS
          </th>
          <th
            className="py-2 px-4 text-right cursor-pointer hover:bg-gray-50"
            onClick={() => onSort("amount")}
            style={{ color: primaryColor }}
          >
            KWOTA
          </th>
          <th className="py-2 px-4 text-center" style={{ color: primaryColor }}>
            STATUS
          </th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) => (
          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-3 px-4 text-gray-600">{transaction.date}</td>
            <td className="py-3 px-4 font-medium">{transaction.description}</td>
            <td
              className={`py-3 px-4 text-right font-medium ${
                transaction.amount.includes("+") ? "text-green-600" : "text-red-600"
              }`}
            >
              {transaction.amount}
            </td>
            <td className="py-3 px-4">
              <div className="flex justify-center">
                <span
                  className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                  style={{ backgroundColor: "rgba(53, 83, 10, 0.1)", color: primaryColor }}
                >
                  {transaction.status}
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TransactionTable;