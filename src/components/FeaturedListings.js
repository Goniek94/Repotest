import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CarListings = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    yearFrom: '',
    yearTo: '',
  });

  // Ładowanie przykładowych ogłoszeń
  useEffect(() => {
    const exampleListings = [
      {
        id: 1,
        title: 'BMW X5 2021',
        description:
          'Luksusowy SUV z pełnym wyposażeniem, skórzana tapicerka, nawigacja. Wyjątkowy komfort i doskonałe osiągi sprawiają, że jest to idealny wybór dla najbardziej wymagających kierowców.',
        price: '120,000 PLN',
        imageUrl: '/images/automobile-1834278_640.jpg',
      },
      {
        id: 2,
        title: 'Audi A4 2020',
        description:
          'Sedan klasy premium, napęd quattro, panoramiczny dach. Auto zaprojektowane z myślą o komforcie i precyzji jazdy, doskonale sprawdza się zarówno w mieście, jak i na trasie.',
        price: '95,000 PLN',
        imageUrl: '/images/dodge-challenger-8214392_640.jpg',
      },
      {
        id: 3,
        title: 'Mercedes-Benz C 200 2019',
        description:
          'Silnik turbo, automat, perfekcyjny stan techniczny. Idealny wybór dla osób ceniących luksus i niezawodność. Samochód w stanie niemal fabrycznym.',
        price: '85,000 PLN',
        imageUrl: '/images/car-1880381_640.jpg',
      },
      {
        id: 4,
        title: 'Volkswagen Golf 2018',
        description:
          'Ekonomiczny hatchback, niski przebieg, zadbany. Kompaktowy samochód świetnie nadający się zarówno na krótkie trasy miejskie, jak i dłuższe podróże.',
        price: '50,000 PLN',
        imageUrl: '/images/toyota-gr-yaris-6751752_640.jpg',
      },
      {
        id: 5,
        title: 'Ford Mustang 2017',
        description:
          'Legendarny muscle car, potężny silnik V8. Auto o niesamowitej mocy i stylu, które zapewnia wyjątkowe emocje na drodze.',
        price: '150,000 PLN',
        imageUrl: '/images/car-1880381_640.jpg',
      },
      {
        id: 6,
        title: 'Toyota Corolla 2021',
        description:
          'Nowoczesny i ekonomiczny, idealny do miasta. Samochód o wyjątkowej niezawodności i niskim zużyciu paliwa, świetny na codzienne dojazdy.',
        price: '65,000 PLN',
        imageUrl: '/images/automobile-1834278_640.jpg',
      },
      {
        id: 7,
        title: 'Kia Sportage 2019',
        description:
          'SUV z napędem 4x4, zadbany, pierwszy właściciel. Przestronny i wszechstronny, doskonały wybór dla rodzin i miłośników przygód.',
        price: '70,000 PLN',
        imageUrl: '/images/toyota-gr-yaris-6751752_640.jpg',
      },
      {
        id: 8,
        title: 'Honda Civic 2020',
        description:
          'Sportowy kompakt z niskim przebiegiem, dynamiczny. Nowoczesny design i świetne osiągi zapewniają przyjemność z każdej jazdy.',
        price: '60,000 PLN',
        imageUrl: '/images/dodge-challenger-8214392_640.jpg',
      },
    ];
    setListings(exampleListings);
  }, []);

  // Pasek wyszukiwania
  const SearchBar = () => (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {/* Marka */}
      <div className="relative">
        <select
          value={filters.brand}
          onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
          className="
            w-full p-3 rounded-[2px] bg-white appearance-none
            border border-gray-300
            focus:outline-none focus:border-[#35530A] focus:ring-2 focus:ring-[#35530A]
          "
        >
          <option value="">Marka (234)</option>
          <option value="bmw">BMW (45)</option>
          <option value="audi">Audi (67)</option>
          <option value="mercedes">Mercedes (89)</option>
          <option value="volkswagen">Volkswagen (33)</option>
        </select>
        {/* Ikona strzałki */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2" 
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Model */}
      <div className="relative">
        <select
          value={filters.model}
          onChange={(e) => setFilters({ ...filters, model: e.target.value })}
          className="
            w-full p-3 rounded-[2px] bg-white appearance-none
            border border-gray-300
            focus:outline-none focus:border-[#35530A] focus:ring-2 focus:ring-[#35530A]
          "
        >
          <option value="">Model (156)</option>
          <option value="x5">X5 (23)</option>
          <option value="a4">A4 (45)</option>
          <option value="c-class">C-Class (34)</option>
          <option value="golf">Golf (54)</option>
        </select>
        {/* Ikona strzałki */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Rok od */}
      <div className="relative">
        <select
          value={filters.yearFrom}
          onChange={(e) => setFilters({ ...filters, yearFrom: e.target.value })}
          className="
            w-full p-3 rounded-[2px] bg-white appearance-none
            border border-gray-300
            focus:outline-none focus:border-[#35530A] focus:ring-2 focus:ring-[#35530A]
          "
        >
          <option value="">Rok od (478)</option>
          {Array.from({ length: 24 }, (_, i) => 2024 - i).map((year) => (
            <option key={year} value={year}>
              {year} ({Math.floor(Math.random() * 50)})
            </option>
          ))}
        </select>
        {/* Ikona strzałki */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg 
            className="w-4 h-4 text-gray-400"
            fill="none" 
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2" 
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Rok do */}
      <div className="relative">
        <select
          value={filters.yearTo}
          onChange={(e) => setFilters({ ...filters, yearTo: e.target.value })}
          className="
            w-full p-3 rounded-[2px] bg-white appearance-none
            border border-gray-300
            focus:outline-none focus:border-[#35530A] focus:ring-2 focus:ring-[#35530A]
          "
        >
          <option value="">Rok do (478)</option>
          {Array.from({ length: 24 }, (_, i) => 2024 - i).map((year) => (
            <option key={year} value={year}>
              {year} ({Math.floor(Math.random() * 50)})
            </option>
          ))}
        </select>
        {/* Ikona strzałki */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg 
            className="w-4 h-4 text-gray-400"
            fill="none" 
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2" 
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  // Render pojedynczej karty
  const renderListingCard = (listing) => (
    <div
      key={listing.id}
      className="bg-white shadow-md overflow-hidden flex flex-col rounded-[2px] border-2 border-gray-200"
    >
      <div className="h-44 rounded-[2px] overflow-hidden">
        <img 
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Szary gradient */}
      <div
        className="text-center py-2"
        style={{
          background: 'linear-gradient(to bottom, #E8E8E8, #FEFEFE)',
        }}
      >
        <h3 className="text-base font-semibold text-gray-800">{listing.title}</h3>
        <div
          className="h-0.5 bg-[#35530A] mx-auto mt-1 rounded-[2px]"
          style={{ width: '70%' }}
        />
      </div>

      <div className="bg-white py-4 flex flex-col justify-between rounded-[2px]">
        <p className="text-sm text-gray-600 text-center px-2 h-24 overflow-hidden">
          {listing.description}
        </p>
        <div
          className="h-0.5 bg-[#35530A] mx-auto mt-4 rounded-[2px]"
          style={{ width: '70%' }}
        />
      </div>

      {/* Sekcja ceny (bez ikonki) */}
      <div
        className="p-3 flex items-center justify-center h-14 rounded-[2px]"
        style={{ backgroundColor: '#35530A' }}
      >
        <span className="font-bold text-white text-lg">{listing.price}</span>
      </div>

      {/* Przycisk */}
      <div className="p-4 h-20 flex items-center rounded-[2px]">
        <button
          onClick={() => navigate(`/listing/${listing.id}`)}
          className="w-full bg-[#35530A] text-white py-2 
                     rounded-[2px] hover:bg-[#2D4A06] transition-colors"
        >
          Pokaż ogłoszenie
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FCFCFC] py-12">
      <div className="container mx-auto px-[10%]">
        <h2 className="text-4xl font-bold text-center text-[#35530A] mb-8">
          OGŁOSZENIA
          <div className="w-24 h-0.5 bg-[#35530A] mx-auto mt-2 rounded-[2px]" />
        </h2>

        {/* Tło w ogłoszeniach #FFFFFF */}
        <div className="bg-white p-8 rounded-[2px] shadow-xl">
          <SearchBar />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {listings.map((listing) => (
              <div key={listing.id} className="flex justify-center rounded-[2px]">
                {renderListingCard(listing)}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/listings')}
              className="bg-[#35530A] text-white py-3 px-8 rounded-[2px] 
                         text-lg hover:bg-[#2D4A06] transition-colors"
            >
              Przejdź do listy ogłoszeń
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarListings;
