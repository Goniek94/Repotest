import { useState } from 'react';

const SimpleUserPanel = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sticky przycisk rozwijający */}
      <button
        onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        className="fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-all"
      >
        {isNavCollapsed ? '↓' : '↑'}
      </button>

      {/* Ukrywana nawigacja */}
      <div
        className={`${isNavCollapsed ? 'w-0 opacity-0' : 'w-64 opacity-100'} bg-gray-100 h-screen sticky top-0 transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4 min-w-[256px]">
          <h2 className="text-xl font-bold mb-4">Panel Administratora</h2>
          <ul className="space-y-2">
            <li>Ostatnie logowanie: 16.06.2025, 14:51</li>
            <li>Konto zweryfikowane</li>
            {/* ... reszta elementów nawigacji */}
          </ul>
        </div>
      </div>

      {/* Główna zawartość z płynnym przesuwem */}
      <div
        className={`flex-1 transition-all duration-300 ${isNavCollapsed ? 'ml-0' : 'ml-64'}`}
      >
        <div className="p-8">
          {/* Statystyki */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatBlock title="Aktywne ogłoszenia" value={0} />
            <StatBlock title="Zakończone transakcje" value={0} />
            <StatBlock title="Wyświetlenia" value={0} />
          </div>

          {/* Sekcja ostatnio oglądane */}
          <h3 className="text-lg font-semibold mb-4">Ostatnio oglądane</h3>
          <div className="space-y-3">
            <VehicleItem name="Opel Astra" price="500 000 zł" />
            <VehicleItem name="Toyota Corolla" price="2500 zł" />
            <VehicleItem name="BMW Seria 2" price="33 000 zł" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBlock = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-gray-600">{title}</div>
  </div>
);

const VehicleItem = ({ name, price }) => (
  <div className="flex justify-between items-center bg-white p-3 rounded border">
    <span>{name}</span>
    <span className="font-semibold">{price}</span>
  </div>
);

export default SimpleUserPanel;
