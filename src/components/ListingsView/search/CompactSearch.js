import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Przykładowe marki i modele
const carData = {
  Audi: ['A1','A3','A4','A5','A6','A7','A8','Q3','Q5','Q7','Q8','TT','R8'],
  BMW: [
    'Seria 1','Seria 2','Seria 3','Seria 4','Seria 5','Seria 6',
    'Seria 7','Seria 8','X1','X2','X3','X4','X5','X6','X7'
  ],
  Mercedes: [
    'Klasa A','Klasa B','Klasa C','Klasa E','Klasa S','CLA','CLS','GLA',
    'GLB','GLC','GLE','GLS'
  ],
  Volkswagen: [
    'Golf','Polo','Passat','Arteon','T-Roc','T-Cross','Tiguan','Touareg',
    'ID.3','ID.4'
  ],
  Toyota: [
    'Yaris','Corolla','Camry','RAV4','C-HR','Highlander','Land Cruiser','Supra','Prius'
  ],
  Ford: ['Fiesta','Focus','Mondeo','Kuga','Puma','Edge','Mustang','Explorer'],
  Opel: ['Corsa','Astra','Insignia','Crossland','Grandland','Mokka'],
  Hyundai: ['i20','i30','i40','Kona','Tucson','Santa Fe','IONIQ','NEXO'],
  Kia: ['Picanto','Rio','Ceed','Proceed','Stinger','XCeed','Sportage','Sorento'],
  Škoda: ['Fabia','Scala','Octavia','Superb','Kamiq','Karoq','Kodiaq','Enyaq'],
};

// Funkcja generująca listę lat (np. 1990 -> aktualny)
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 1990; y--) {
    years.push(y);
  }
  return years;
};

export default function CompactSearch({ initialFilters = {}, onFilterChange }) {
  const navigate = useNavigate();

  // Stan formularza
  const [formData, setFormData] = useState({
    // ----- PODSTAWOWE -----
    brand: initialFilters.brand || '',
    model: initialFilters.model || '',
    yearFrom: initialFilters.yearFrom || '',
    yearTo: initialFilters.yearTo || '',
    priceFrom: initialFilters.priceFrom || '',
    priceTo: initialFilters.priceTo || '',
    mileageFrom: initialFilters.mileageFrom || '',
    mileageTo: initialFilters.mileageTo || '',

    // ----- ZAAWANSOWANE -----
    condition: initialFilters.condition || '',
    accidentStatus: initialFilters.accidentStatus || '',
    damageStatus: initialFilters.damageStatus || '',
    tuning: initialFilters.tuning || '',
    imported: initialFilters.imported || '',
    registeredInPL: initialFilters.registeredInPL || '',
    firstOwner: initialFilters.firstOwner || '',
    disabledAdapted: initialFilters.disabledAdapted || '',

    generation: initialFilters.generation || '',
    version: initialFilters.version || '',
    bodyType: initialFilters.bodyType || '',
    color: initialFilters.color || '',
    fuelType: initialFilters.fuelType || '',
    power: initialFilters.power || '',
    engineSize: initialFilters.engineSize || '',
    transmission: initialFilters.transmission || '',
    drive: initialFilters.drive || '',
    doors: initialFilters.doors || '',
    weight: initialFilters.weight || '',
    countryOfOrigin: initialFilters.countryOfOrigin || '',
    voivodeship: initialFilters.voivodeship || '',
    city: initialFilters.city || ''
  });

  // Modele dostępne w zależności od brand
  const [availableModels, setAvailableModels] = useState([]);

  // Czy widok mobilny
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Czy pokazać sekcję zaawansowaną (desktop)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const shouldShowAdvanced = isMobile ? true : showAdvanced;

  // Sztuczna liczba pasujących wyników
  const [matchingResults, setMatchingResults] = useState(2500);

  // Sposób liczenia wyniku (prosty, „na oko"):
  const calculateMatchingResults = (data) => {
    let base = 2500;
    if (data.brand) base *= 0.9;
    if (data.model) base *= 0.8;
    if (data.yearFrom) base *= 0.95;
    if (data.yearTo) base *= 0.95;
    if (data.priceFrom || data.priceTo) base *= 0.9;
    if (data.mileageFrom || data.mileageTo) base *= 0.9;
    if (data.condition) base *= 0.9;
    if (data.damageStatus) base *= 0.9;
    if (data.fuelType) base *= 0.8;
    // ...
    return Math.floor(base);
  };

  // Aktualizacja dostępnych modeli gdy zmienia się marka
  useEffect(() => {
    if (formData.brand) {
      setAvailableModels(carData[formData.brand] || []);
    }
  }, [formData.brand]);

  useEffect(() => {
    setMatchingResults(calculateMatchingResults(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'brand') {
      setAvailableModels(carData[value] || []);
      // Reset modelu
      setFormData((prev2) => ({ ...prev2, model: '' }));
    }
  };

  const handleSearch = () => {
    // Przekazanie filtrów do komponentu nadrzędnego
    if (onFilterChange) {
      onFilterChange(formData);
    }
    
    // Przekierowanie do listy ogłoszeń jeśli nie jesteśmy na stronie /listings
    if (window.location.pathname !== '/listings') {
      navigate('/listings');
    }
  };

  // Podstawowa sekcja – 4 kolumny
  const BasicSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Marka */}
      <div>
        <label className="block text-sm font-semibold text-[#35530A] mb-1">
          Marka
        </label>
        <select
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-[#35530A] rounded-[2px]"
        >
          <option value="">---</option>
          {Object.keys(carData).map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div>
        <label className="block text-sm font-semibold text-[#35530A] mb-1">
          Model
        </label>
        <select
          name="model"
          value={formData.model}
          disabled={!formData.brand}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-[#35530A] rounded-[2px] disabled:bg-gray-100"
        >
          <option value="">---</option>
          {availableModels.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Rok od */}
      <div>
        <label className="block text-sm font-semibold text-[#35530A] mb-1">
          Rok od
        </label>
        <select
          name="yearFrom"
          value={formData.yearFrom}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-[#35530A] rounded-[2px]"
        >
          <option value="">---</option>
          {generateYearOptions().map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </select>
      </div>

      {/* Rok do */}
      <div>
        <label className="block text-sm font-semibold text-[#35530A] mb-1">
          Rok do
        </label>
        <select
          name="yearTo"
          value={formData.yearTo}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-[#35530A] rounded-[2px]"
        >
          <option value="">---</option>
          {generateYearOptions().map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </select>
      </div>

      {/* Cena od */}
      <div>
        <label className="block text-sm font-semibold text-[#35530A] mb-1">
          Cena od
        </label>
        <input
          type="number"
          name="priceFrom"
          min="0"
          value={formData.priceFrom}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-[#35530A] rounded-[2px]"
        />
      </div>

      {/* Cena do */}
      <div>
        <label className="block text-sm font-semibold text-[#35530A] mb-1">
          Cena do
        </label>
        <input
          type="number"
          name="priceTo"
          min="0"
          value={formData.priceTo}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-[#35530A] rounded-[2px]"
        />
      </div>

      {/* Przebieg od */}
      <div>
        <label className="block text-sm font-semibold text-[#35530A] mb-1">
          Przebieg od
        </label>
        <input
          type="number"
          name="mileageFrom"
          min="0"
          value={formData.mileageFrom}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-[#35530A] rounded-[2px]"
        />
      </div>

      {/* Przebieg do */}
      <div>
        <label className="block text-sm font-semibold text-[#35530A] mb-1">
          Przebieg do
        </label>
        <input
          type="number"
          name="mileageTo"
          min="0"
          value={formData.mileageTo}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-[#35530A] rounded-[2px]"
        />
      </div>
    </div>
  );

  // Zaawansowana sekcja – 4 kolumny, sporo pól
  const AdvancedSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      {/* Condition */}
      <div>
        <label className="block text-sm font-semibold text-[#35530A] mb-1">
          Stan pojazdu
        </label>
        <select
          name="condition"
          value={formData.condition}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-[#35530A] rounded-[2px]"
        >
          <option value="">---</option>
          <option value="Nowy">Nowy</option>
          <option value="Używany">Używany</option>
        </select>
      </div>

      {/* pozostałe pola z zaawansowanej sekcji */}
      {/* ... */}
      
      {/* Wypadkowość */}
      <div>
        <label className="block text-sm font-semibold text-[#35530A] mb-1">
          Wypadkowość
        </label>
        <select
          name="accidentStatus"
          value={formData.accidentStatus}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-[#35530A] rounded-[2px]"
        >
          <option value="">---</option>
          <option value="Bezwypadkowy">Bezwypadkowy</option>
          <option value="Powypadkowy">Powypadkowy</option>
        </select>
      </div>

      {/* Paliwo */}
      <div>
        <label className="block text-sm font-semibold text-[#35530A] mb-1">
          Paliwo
        </label>
        <select
          name="fuelType"
          value={formData.fuelType}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-[#35530A] rounded-[2px]"
        >
          <option value="">---</option>
          <option value="Benzyna">Benzyna</option>
          <option value="Diesel">Diesel</option>
          <option value="Benzyna+LPG">Benzyna + LPG</option>
          <option value="Elektryczny">Elektryczny</option>
          <option value="Hybryda">Hybryda</option>
        </select>
      </div>

      {/* Skrzynia biegów */}
      <div>
        <label className="block text-sm font-semibold text-[#35530A] mb-1">
          Skrzynia
        </label>
        <select
          name="transmission"
          value={formData.transmission}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-[#35530A] rounded-[2px]"
        >
          <option value="">---</option>
          <option value="Manualna">Manualna</option>
          <option value="Automatyczna">Automatyczna</option>
          <option value="Półautomatyczna">Półautomatyczna</option>
        </select>
      </div>
    </div>
  );

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="border border-[#35530A] rounded-[2px] p-8 shadow-md">
          {/* Sekcja podstawowa */}
          <BasicSection />

          {/* Sekcja zaawansowana */}
          {shouldShowAdvanced && <AdvancedSection />}

          <div className="relative mt-6 flex items-center w-full">
            {/* Przycisk Zaawansowane – na desktop */}
            {!isMobile && (
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="
                  border border-[#35530A]
                  rounded-[2px]
                  px-4
                  py-2
                  text-sm
                  text-[#35530A]
                  font-semibold
                  uppercase
                  bg-white
                  hover:bg-[#2D4A06]
                  hover:text-white
                  transition-colors
                  absolute
                  left-1/2
                  -translate-x-1/2
                "
              >
                {showAdvanced
                  ? 'Ukryj zaawansowane'
                  : 'Zaawansowane wyszukiwanie'}
              </button>
            )}

            {/* Przycisk Pokaż ogłoszenia */}
            <button
              type="button"
              onClick={handleSearch}
              className="
                bg-[#35530A]
                text-white
                rounded-[2px]
                px-6
                py-2
                text-sm
                font-bold
                uppercase
                hover:bg-[#2D4A06]
                transition-colors
                flex
                items-center
                gap-2
                ml-auto
              "
            >
              <span>Pokaż ogłoszenia</span>
              <span className="text-xs bg-[#35530A] text-white px-2 py-0.5 rounded">
                ({matchingResults})
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}