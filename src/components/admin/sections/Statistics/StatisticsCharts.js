import React from 'react';

const StatisticsCharts = ({ data = {}, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Users chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rejestracje użytkowników</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>Wykres użytkowników</p>
            <p className="text-sm mt-1">Integracja z biblioteką wykresów</p>
          </div>
        </div>
      </div>

      {/* Listings chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nowe ogłoszenia</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p>Wykres ogłoszeń</p>
            <p className="text-sm mt-1">Integracja z biblioteką wykresów</p>
          </div>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Przychody</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">💰</div>
            <p>Wykres przychodów</p>
            <p className="text-sm mt-1">Integracja z biblioteką wykresów</p>
          </div>
        </div>
      </div>

      {/* Activity chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktywność</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">⚡</div>
            <p>Wykres aktywności</p>
            <p className="text-sm mt-1">Integracja z biblioteką wykresów</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCharts;