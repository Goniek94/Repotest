import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, 
  Pie, Cell, AreaChart, Area 
} from 'recharts';
import { FiEye, FiMessageSquare, FiHeart, FiStar, FiTrendingUp, FiClock } from 'react-icons/fi';

const Stats = () => {
  const [selectedListing, setSelectedListing] = useState('all');

  // Dane statystyk dla każdego ogłoszenia
  const userListings = [
    { 
      id: 1, 
      title: 'BMW M3 Competition', 
      price: '450 000 PLN', 
      date: '2024-01-15',
      stats: {
        views: 856,
        visits: 75,
        messages: 12,
        favorites: 25,
        rating: 4.8,
        viewsData: [
          { month: 'Sty', wyświetlenia: 150, podobneOgłoszenia: 120, wiadomości: 5 },
          { month: 'Lut', wyświetlenia: 220, podobneOgłoszenia: 150, wiadomości: 8 },
          { month: 'Mar', wyświetlenia: 180, podobneOgłoszenia: 130, wiadomości: 6 },
          { month: 'Kwi', wyświetlenia: 240, podobneOgłoszenia: 180, wiadomości: 10 },
          { month: 'Maj', wyświetlenia: 210, podobneOgłoszenia: 160, wiadomości: 7 },
          { month: 'Cze', wyświetlenia: 260, podobneOgłoszenia: 200, wiadomości: 12 }
        ],
        weeklyActivity: [
          { name: 'Poniedziałek', wizyty: 25 },
          { name: 'Wtorek', wizyty: 32 },
          { name: 'Środa', wizyty: 28 },
          { name: 'Czwartek', wizyty: 35 },
          { name: 'Piątek', wizyty: 40 },
          { name: 'Sobota', wizyty: 45 },
          { name: 'Niedziela', wizyty: 38 }
        ],
        sourceData: [
          { name: 'Wyszukiwarka', value: 45, color: '#4ade80' },
          { name: 'Bezpośrednio', value: 25, color: '#3b82f6' },
          { name: 'Podobne ogłoszenia', value: 20, color: '#f472b6' },
          { name: 'Media społecznościowe', value: 10, color: '#fbbf24' }
        ],
        priceHistory: [
          { date: '2024-01', cena: 450000 },
          { date: '2024-02', cena: 445000 },
          { date: '2024-03', cena: 445000 },
          { date: '2024-04', cena: 440000 },
          { date: '2024-05', cena: 440000 },
          { date: '2024-06', cena: 435000 }
        ]
      }
    },
    // ... więcej ogłoszeń ...
  ];

  const currentListing = userListings.find(listing => listing.id === parseInt(selectedListing)) || userListings[0];

  return (
    <div className="space-y-6 p-6">
      {/* Nagłówek i selektor */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Statystyki ogłoszenia</h2>
          <p className="text-gray-500">Szczegółowa analiza wydajności Twoich ogłoszeń</p>
        </div>
        <select 
          value={selectedListing}
          onChange={(e) => setSelectedListing(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">Wszystkie ogłoszenia</option>
          {userListings.map((listing) => (
            <option key={listing.id} value={listing.id}>
              {listing.title} - {listing.price}
            </option>
          ))}
        </select>
      </div>

      {/* Karty ze statystykami */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Wyświetlenia</p>
              <p className="text-2xl font-bold">{currentListing.stats.views}</p>
              <p className="text-sm text-gray-500 mt-1">Ostatnie 30 dni</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FiEye className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Wiadomości</p>
              <p className="text-2xl font-bold">{currentListing.stats.messages}</p>
              <p className="text-sm text-gray-500 mt-1">Łącznie</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FiMessageSquare className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Ulubione</p>
              <p className="text-2xl font-bold">{currentListing.stats.favorites}</p>
              <p className="text-sm text-gray-500 mt-1">Zapisane</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <FiHeart className="text-2xl text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Ocena</p>
              <p className="text-2xl font-bold">{currentListing.stats.rating}</p>
              <p className="text-sm text-gray-500 mt-1">Średnia</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <FiStar className="text-2xl text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Szczegóły ogłoszenia */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Szczegóły ogłoszenia</h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Aktywne
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600">Data wystawienia</p>
            <p className="font-semibold">{currentListing.date}</p>
          </div>
          <div>
            <p className="text-gray-600">Aktualna cena</p>
            <p className="font-semibold">{currentListing.price}</p>
          </div>
          <div>
            <p className="text-gray-600">Skuteczność</p>
            <p className="font-semibold text-green-600">85%</p>
          </div>
        </div>
      </div>

      {/* Wykresy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wykres wyświetleń */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Trend wyświetleń</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentListing.stats.viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="wyświetlenia" 
                  stroke="#4ade80" 
                  fill="#4ade80" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="podobneOgłoszenia" 
                  stroke="#818cf8" 
                  fill="#818cf8" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wykres aktywności tygodniowej */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Aktywność w ciągu tygodnia</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentListing.stats.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="wizyty" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Źródła ruchu */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Źródła odwiedzin</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentListing.stats.sourceData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {currentListing.stats.sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historia ceny */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Historia ceny</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentListing.stats.priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => new Intl.NumberFormat('pl-PL', {
                    style: 'currency',
                    currency: 'PLN'
                  }).format(value)}
                />
                <Line 
                  type="monotone" 
                  dataKey="cena" 
                  stroke="#f472b6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabela z historią aktywności */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Historia aktywności</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Typ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Szczegóły</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">2024-01-15</td>
                <td className="px-6 py-4">Wiadomość</td>
                <td className="px-6 py-4">Nowa wiadomość od użytkownika</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Odpowiedziano
                  </span>
                </td>
              </tr>
              {/* Więcej wierszy... */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stats;