import React, { useEffect, useState } from 'react';
import RecentListingItem from './components/RecentListingItem';
import ViewHistoryService from '../../services/viewHistoryService';

const PRIMARY_COLOR = '#35530A';

const ViewHistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(ViewHistoryService.getViewHistory());
  }, []);

  if (history.length === 0) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Ostatnio oglądane
        </h1>
        <p className="text-center text-gray-600">Brak historii przeglądania.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Ostatnio oglądane</h1>
      <div className="space-y-2">
        {history.map((id) => (
          <RecentListingItem
            key={id}
            title={id}
            href={`/listing/${id}`}
            color={PRIMARY_COLOR}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewHistoryPage;
