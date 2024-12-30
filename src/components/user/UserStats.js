import React, { useState } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  // ==========================
  //   1. STAN - aktywna sekcja
  // ==========================
  // Możliwe wartości: 'myAds' | 'analysis' | 'settings'
  const [activeSection, setActiveSection] = useState('myAds');

  // ==========================
  //   2. DANE OGŁOSZEŃ
  // ==========================
  const adsData = [
    {
      id: '6130952902',
      title: 'BMW Seria 6 E24 635csi',
      // Statystyki globalne (dla sum 7/30/90 dni) - do wyświetlania w opisach
      viewsLast7: 1746,
      viewsLast30: 3400,
      viewsLast90: 7000,
      visitsLast7: 175,
      visitsLast30: 310,
      visitsLast90: 500,
      messagesLast7: 0,
      messagesLast30: 5,
      messagesLast90: 18,
      // Dane do wykresu (ostatnie 7 dni)
      dataViews7: [
        { day: '1', Wyświetlenia: 350, 'Podobne ogłoszenia': 280 },
        { day: '2', Wyświetlenia: 320, 'Podobne ogłoszenia': 200 },
        { day: '3', Wyświetlenia: 290, 'Podobne ogłoszenia': 260 },
        { day: '4', Wyświetlenia: 270, 'Podobne ogłoszenia': 220 },
        { day: '5', Wyświetlenia: 310, 'Podobne ogłoszenia': 230 },
        { day: '6', Wyświetlenia: 400, 'Podobne ogłoszenia': 340 },
        { day: '7', Wyświetlenia: 150, 'Podobne ogłoszenia': 190 },
      ],
      // Dane (ostatnie 30 dni) - uproszczone w formie tygodni
      dataViews30: [
        { day: 'Tydz 1', Wyświetlenia: 900, 'Podobne ogłoszenia': 750 },
        { day: 'Tydz 2', Wyświetlenia: 500, 'Podobne ogłoszenia': 630 },
        { day: 'Tydz 3', Wyświetlenia: 700, 'Podobne ogłoszenia': 560 },
        { day: 'Tydz 4', Wyświetlenia: 1300, 'Podobne ogłoszenia': 980 },
      ],
      // Dane (ostatnie 90 dni) - uproszczone w formie miesięcy
      dataViews90: [
        { month: 'Marzec', Wyświetlenia: 2200, 'Podobne ogłoszenia': 2000 },
        { month: 'Kwiecień', Wyświetlenia: 1800, 'Podobne ogłoszenia': 1700 },
        { month: 'Maj', Wyświetlenia: 3000, 'Podobne ogłoszenia': 2800 },
      ],
      bgColor: 'bg-green-700', // kolor tła w nagłówku
    },
    {
      id: '9999999',
      title: 'Opel Corsa 1.2 Benzyna',
      viewsLast7: 1000,
      viewsLast30: 2400,
      viewsLast90: 3900,
      visitsLast7: 90,
      visitsLast30: 160,
      visitsLast90: 280,
      messagesLast7: 5,
      messagesLast30: 7,
      messagesLast90: 15,
      dataViews7: [
        { day: '1', Wyświetlenia: 100, 'Podobne ogłoszenia': 120 },
        { day: '2', Wyświetlenia: 140, 'Podobne ogłoszenia': 130 },
        { day: '3', Wyświetlenia: 160, 'Podobne ogłoszenia': 150 },
        { day: '4', Wyświetlenia: 90, 'Podobne ogłoszenia': 110 },
        { day: '5', Wyświetlenia: 80, 'Podobne ogłoszenia': 70 },
        { day: '6', Wyświetlenia: 200, 'Podobne ogłoszenia': 220 },
        { day: '7', Wyświetlenia: 230, 'Podobne ogłoszenia': 250 },
      ],
      dataViews30: [
        { day: 'Tydz 1', Wyświetlenia: 300, 'Podobne ogłoszenia': 320 },
        { day: 'Tydz 2', Wyświetlenia: 400, 'Podobne ogłoszenia': 380 },
        { day: 'Tydz 3', Wyświetlenia: 500, 'Podobne ogłoszenia': 460 },
        { day: 'Tydz 4', Wyświetlenia: 1200, 'Podobne ogłoszenia': 1300 },
      ],
      dataViews90: [
        { month: 'Marzec', Wyświetlenia: 1000, 'Podobne ogłoszenia': 900 },
        { month: 'Kwiecień', Wyświetlenia: 1200, 'Podobne ogłoszenia': 1100 },
        { month: 'Maj', Wyświetlenia: 1700, 'Podobne ogłoszenia': 1500 },
      ],
      bgColor: 'bg-blue-700',
    },
    {
      id: '1234567',
      title: 'Audi A6 3.0 TDI',
      viewsLast7: 2500,
      viewsLast30: 5200,
      viewsLast90: 8400,
      visitsLast7: 210,
      visitsLast30: 540,
      visitsLast90: 920,
      messagesLast7: 2,
      messagesLast30: 10,
      messagesLast90: 25,
      dataViews7: [
        { day: '1', Wyświetlenia: 400, 'Podobne ogłoszenia': 300 },
        { day: '2', Wyświetlenia: 380, 'Podobne ogłoszenia': 290 },
        { day: '3', Wyświetlenia: 370, 'Podobne ogłoszenia': 310 },
        { day: '4', Wyświetlenia: 430, 'Podobne ogłoszenia': 350 },
        { day: '5', Wyświetlenia: 500, 'Podobne ogłoszenia': 420 },
        { day: '6', Wyświetlenia: 320, 'Podobne ogłoszenia': 260 },
        { day: '7', Wyświetlenia: 50, 'Podobne ogłoszenia': 90 },
      ],
      dataViews30: [
        { day: 'Tydz 1', Wyświetlenia: 1200, 'Podobne ogłoszenia': 920 },
        { day: 'Tydz 2', Wyświetlenia: 700, 'Podobne ogłoszenia': 530 },
        { day: '3', Wyświetlenia: 800, 'Podobne ogłoszenia': 710 },
        { day: '4', Wyświetlenia: 2500, 'Podobne ogłoszenia': 1900 },
      ],
      dataViews90: [
        { month: 'Marzec', Wyświetlenia: 2400, 'Podobne ogłoszenia': 2200 },
        { month: 'Kwiecień', Wyświetlenia: 1800, 'Podobne ogłoszenia': 1400 },
        { month: 'Maj', Wyświetlenia: 4200, 'Podobne ogłoszenia': 3300 },
      ],
      bgColor: 'bg-red-700',
    },
  ];

  // ==========================
  //   3. STAN i LOGIKA ANALIZY
  // ==========================
  // Które ogłoszenie jest wybrane do analizy
  const [selectedAdIndex, setSelectedAdIndex] = useState(0);

  // Wybrany zakres dat (7, 30, 90)
  const [dateRange, setDateRange] = useState('7'); // '7' | '30' | '90'

  // Pomocniczo wyciągamy wybrane ogłoszenie
  const selectedAd = adsData[selectedAdIndex];

  // Funkcja pomocnicza do pobierania odpowiedniej tablicy danych do LineChart
  const getViewsData = () => {
    if (dateRange === '7') return selectedAd.dataViews7;
    if (dateRange === '30') return selectedAd.dataViews30;
    return selectedAd.dataViews90;
  };

  // ==========================
  //   4. RENDER
  // ==========================
  return (
    <div className="flex h-screen bg-gray-50">
      {/* PANEL BOCZNY */}
      <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
        <h2 className="text-2xl font-bold p-4">Panel</h2>

        {/* Przycisk "Moje ogłoszenia" */}
        <button
          className={`text-left py-2 px-2 hover:bg-gray-100 ${
            activeSection === 'myAds' ? 'font-bold bg-gray-100' : ''
          }`}
          onClick={() => setActiveSection('myAds')}
        >
          Moje ogłoszenia
        </button>

        {/* Przycisk "Analiza" */}
        <button
          className={`text-left py-2 px-2 hover:bg-gray-100 ${
            activeSection === 'analysis' ? 'font-bold bg-gray-100' : ''
          }`}
          onClick={() => setActiveSection('analysis')}
        >
          Analiza
        </button>

        {/* Przycisk "Ustawienia" */}
        <button
          className={`text-left py-2 px-2 hover:bg-gray-100 ${
            activeSection === 'settings' ? 'font-bold bg-gray-100' : ''
          }`}
          onClick={() => setActiveSection('settings')}
        >
          Ustawienia
        </button>
      </div>

      {/* SEKCJA GŁÓWNA */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeSection === 'myAds' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">MOJE OGŁOSZENIA</h1>

            {/* Tutaj możesz np. zrobić tabelkę z ogłoszeniami. */}
            <table className="min-w-full bg-white shadow">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Tytuł</th>
                </tr>
              </thead>
              <tbody>
                {adsData.map((ad) => (
                  <tr
                    key={ad.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      // Jeśli użytkownik kliknie wiersz, możemy
                      // np. automatycznie przejść do "Analizy" wybranego ogłoszenia:
                      setSelectedAdIndex(
                        adsData.findIndex((x) => x.id === ad.id)
                      );
                      setActiveSection('analysis');
                    }}
                  >
                    <td className="p-2">{ad.id}</td>
                    <td className="p-2">{ad.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'analysis' && (
          <div>
            <h1 className="text-2xl font-bold mb-2">ANALIZA OGŁOSZENIA</h1>
            <p className="text-gray-600 mb-4">
              Wybierz ogłoszenie i zakres dat, by zobaczyć szczegółowe statystyki
            </p>

            {/* Wybór ogłoszenia */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div>
                <label className="mr-2 font-semibold text-gray-700">
                  Ogłoszenie:
                </label>
                <select
                  className="border border-gray-300 rounded px-2 py-1"
                  value={selectedAdIndex}
                  onChange={(e) => setSelectedAdIndex(Number(e.target.value))}
                >
                  {adsData.map((ad, i) => (
                    <option key={ad.id} value={i}>
                      {ad.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mr-2 font-semibold text-gray-700">
                  Zakres dat:
                </label>
                <select
                  className="border border-gray-300 rounded px-2 py-1"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="7">Ostatnie 7 dni</option>
                  <option value="30">Ostatnie 30 dni</option>
                  <option value="90">Ostatnie 90 dni</option>
                </select>
              </div>
            </div>

            {/* Karta analizy */}
            <div className="max-w-4xl bg-white shadow rounded">
              <div className={`${selectedAd.bgColor} text-white p-4 rounded-t`}>
                <h2 className="text-xl font-bold uppercase">Analiza</h2>
                <div>
                  <strong>{selectedAd.title}</strong> <br />
                  ID: {selectedAd.id}
                </div>
              </div>
              <div className="p-6 space-y-8">
                {/* Statystyki liczbowe */}
                <div className="flex flex-col gap-2">
                  <div>
                    <strong>Wyświetlenia:</strong>{' '}
                    {dateRange === '7'
                      ? selectedAd.viewsLast7
                      : dateRange === '30'
                      ? selectedAd.viewsLast30
                      : selectedAd.viewsLast90}
                  </div>
                  <div>
                    <strong>Odwiedziny:</strong>{' '}
                    {dateRange === '7'
                      ? selectedAd.visitsLast7
                      : dateRange === '30'
                      ? selectedAd.visitsLast30
                      : selectedAd.visitsLast90}
                  </div>
                  <div>
                    <strong>Wiadomości:</strong>{' '}
                    {dateRange === '7'
                      ? selectedAd.messagesLast7
                      : dateRange === '30'
                      ? selectedAd.messagesLast30
                      : selectedAd.messagesLast90}
                  </div>
                </div>

                {/* Wykres linowy (Wyświetlenia vs Podobne ogłoszenia) */}
                <div>
                  <h3 className="font-bold mb-2">
                    Wykres wyświetleń w wybranym okresie
                  </h3>
                  <div className="w-full h-64">
                    <ResponsiveContainer>
                      <LineChart
                        data={getViewsData()}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis
                          dataKey={
                            dateRange === '7'
                              ? 'day'
                              : dateRange === '30'
                              ? 'day'
                              : 'month'
                          }
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="Wyświetlenia"
                          stroke="#82ca9d"
                          strokeWidth={3}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="Podobne ogłoszenia"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Wykres kołowy */}
                <div>
                  <h3 className="font-bold mb-2">Wiadomości vs. Odwiedziny</h3>
                  <div className="flex items-center gap-4">
                    <PieChart width={200} height={200}>
                      <Pie
                        data={[
                          {
                            name: 'Wiadomości',
                            value:
                              dateRange === '7'
                                ? selectedAd.messagesLast7
                                : dateRange === '30'
                                ? selectedAd.messagesLast30
                                : selectedAd.messagesLast90,
                          },
                          {
                            name: 'Odwiedziny',
                            value:
                              dateRange === '7'
                                ? selectedAd.visitsLast7
                                : dateRange === '30'
                                ? selectedAd.visitsLast30
                                : selectedAd.visitsLast90,
                          },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        label
                      >
                        {/* Dwa sektory, można dać rożne kolory */}
                        <Cell fill="#82ca9d" />
                        <Cell fill="#8884d8" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                    <div className="text-sm">
                      <p>
                        <span className="inline-block w-3 h-3 bg-[#82ca9d] mr-1" />
                        Wiadomości
                      </p>
                      <p>
                        <span className="inline-block w-3 h-3 bg-[#8884d8] mr-1" />
                        Odwiedziny
                      </p>
                    </div>
                  </div>
                </div>
                {/* Koniec PieChart */}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">USTAWIENIA</h1>
            <p>Tutaj możesz umieścić np. ustawienia konta, zmiany hasła, itd.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
