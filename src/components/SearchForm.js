import React, { useState } from 'react';

const carData = {
  Audi: ['A1','A3','A4','A5','A6','A7','A8','Q3','Q5','Q7','Q8','TT','R8'],
  BMW: [
    'Seria 1','Seria 2','Seria 3','Seria 4','Seria 5','Seria 6','Seria 7','Seria 8',
    'X1','X2','X3','X4','X5','X6','X7'
  ],
  Mercedes: [
    'Klasa A','Klasa B','Klasa C','Klasa E','Klasa S','CLA','CLS','GLA','GLB',
    'GLC','GLE','GLS'
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

const bodyTypes = [
  'Sedan','Hatchback','SUV','Kombi','Coupé','Cabrio','VAN','Pickup'
];

const advancedOptions = {
  damageStatus: ['Brak uszkodzeń','Lekko uszkodzony','Poważnie uszkodzony'],
  country: ['Polska','Niemcy','Francja','Włochy'],
  fuelType: ['Benzyna','Diesel','Elektryczny','Hybrydowy'],
  driveType: ['Przedni','Tylny','4x4'],
};

const SearchForm = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    priceFrom: '',
    priceTo: '',
    yearFrom: '',
    yearTo: '',
    bodyType: '',
    damageStatus: '',
    country: '',
    fuelType: '',
    driveType: '',
    mileageFrom: '',
    mileageTo: '',
    location: '',
  });

  const [availableModels, setAvailableModels] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    // Od 1990 do obecnego roku
    return Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    // Jeśli pole dotyczy ceny lub przebiegu – nie dopuść wartości ujemnych
    if (['priceFrom','priceTo','mileageFrom','mileageTo'].includes(name)) {
      if (Number(value) < 0) {
        value = 0;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Jeśli wybrano markę – zaktualizuj modele
    if (name === 'make') {
      setAvailableModels(carData[value] || []);
      setFormData((prev) => ({ ...prev, model: '' }));
    }
  };

  const handleSearch = () => {
    console.log('Parametry wyszukiwania:', formData);
    // ... dalsza logika
  };

  return (
    <section
      className="py-12"
      style={{
        backgroundColor: '#FCFCFC', // Tło główne sekcji
      }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative w-full max-w-5xl mx-auto bg-white border border-[#35530A] rounded-[2px] p-8 shadow-lg">
          <h2 className="text-4xl font-bold text-[#35530A] text-center mb-6 uppercase">
            WYSZUKAJ POJAZD
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Marka */}
            <div>
              <label className="block text-base font-semibold text-[#35530A]">
                Marka pojazdu
              </label>
              <select
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-[2px] border border-[#35530A]
                           focus:ring-[#35530A] focus:border-[#35530A]"
              >
                <option value="">Wybierz markę</option>
                {Object.keys(carData).map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-base font-semibold text-[#35530A]">
                Model pojazdu
              </label>
              <select
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                disabled={!formData.make}
                className="mt-1 w-full rounded-[2px] border border-[#35530A]
                           focus:ring-[#35530A] focus:border-[#35530A]"
              >
                <option value="">Wybierz model</option>
                {availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Cena od */}
            <div>
              <label className="block text-base font-semibold text-[#35530A]">
                Cena od (PLN)
              </label>
              <input
                type="number"
                min="0"
                name="priceFrom"
                placeholder="Cena od"
                value={formData.priceFrom}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-[2px] border border-[#35530A]
                           focus:ring-[#35530A] focus:border-[#35530A]"
              />
            </div>

            {/* Cena do */}
            <div>
              <label className="block text-base font-semibold text-[#35530A]">
                Cena do (PLN)
              </label>
              <input
                type="number"
                min="0"
                name="priceTo"
                placeholder="Cena do"
                value={formData.priceTo}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-[2px] border border-[#35530A]
                           focus:ring-[#35530A] focus:border-[#35530A]"
              />
            </div>

            {/* Rok od */}
            <div>
              <label className="block text-base font-semibold text-[#35530A]">
                Rok produkcji od
              </label>
              <select
                name="yearFrom"
                value={formData.yearFrom}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-[2px] border border-[#35530A]
                           focus:ring-[#35530A] focus:border-[#35530A]"
              >
                <option value="">Wybierz rok</option>
                {generateYearOptions().map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Rok do */}
            <div>
              <label className="block text-base font-semibold text-[#35530A]">
                Rok produkcji do
              </label>
              <select
                name="yearTo"
                value={formData.yearTo}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-[2px] border border-[#35530A]
                           focus:ring-[#35530A] focus:border-[#35530A]"
              >
                <option value="">Wybierz rok</option>
                {generateYearOptions().map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Typ nadwozia */}
            <div>
              <label className="block text-base font-semibold text-[#35530A]">
                Typ nadwozia
              </label>
              <select
                name="bodyType"
                value={formData.bodyType}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-[2px] border border-[#35530A]
                           focus:ring-[#35530A] focus:border-[#35530A]"
              >
                <option value="">Wybierz typ nadwozia</option>
                {bodyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Zaawansowane */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {/* Stan uszkodzeń */}
              <div>
                <label className="block text-base font-semibold text-[#35530A]">
                  Stan uszkodzeń
                </label>
                <select
                  name="damageStatus"
                  value={formData.damageStatus}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-[2px] border border-[#35530A]
                             focus:ring-[#35530A] focus:border-[#35530A]"
                >
                  <option value="">Wybierz stan uszkodzeń</option>
                  {advancedOptions.damageStatus.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kraj pochodzenia */}
              <div>
                <label className="block text-base font-semibold text-[#35530A]">
                  Kraj pochodzenia
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-[2px] border border-[#35530A]
                             focus:ring-[#35530A] focus:border-[#35530A]"
                >
                  <option value="">Wybierz kraj</option>
                  {advancedOptions.country.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rodzaj paliwa */}
              <div>
                <label className="block text-base font-semibold text-[#35530A]">
                  Rodzaj paliwa
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-[2px] border border-[#35530A]
                             focus:ring-[#35530A] focus:border-[#35530A]"
                >
                  <option value="">Wybierz rodzaj paliwa</option>
                  {advancedOptions.fuelType.map((fuel) => (
                    <option key={fuel} value={fuel}>
                      {fuel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Przebieg od */}
              <div>
                <label className="block text-base font-semibold text-[#35530A]">
                  Przebieg od (km)
                </label>
                <input
                  type="number"
                  min="0"
                  name="mileageFrom"
                  placeholder="Przebieg od"
                  value={formData.mileageFrom}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-[2px] border border-[#35530A]
                             focus:ring-[#35530A] focus:border-[#35530A]"
                />
              </div>

              {/* Przebieg do */}
              <div>
                <label className="block text-base font-semibold text-[#35530A]">
                  Przebieg do (km)
                </label>
                <input
                  type="number"
                  min="0"
                  name="mileageTo"
                  placeholder="Przebieg do"
                  value={formData.mileageTo}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-[2px] border border-[#35530A]
                             focus:ring-[#35530A] focus:border-[#35530A]"
                />
              </div>

              {/* Lokalizacja */}
              <div>
                <label className="block text-base font-semibold text-[#35530A]">
                  Lokalizacja
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Wprowadź lokalizację"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-[2px] border border-[#35530A]
                             focus:ring-[#35530A] focus:border-[#35530A]"
                />
              </div>

              {/* Silnik i napęd */}
              <div>
                <label className="block text-base font-semibold text-[#35530A]">
                  Silnik i napęd
                </label>
                <select
                  name="driveType"
                  value={formData.driveType}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-[2px] border border-[#35530A]
                             focus:ring-[#35530A] focus:border-[#35530A]"
                >
                  <option value="">Wybierz silnik i napęd</option>
                  {advancedOptions.driveType.map((drive) => (
                    <option key={drive} value={drive}>
                      {drive}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Dolna sekcja przycisków */}
          <div className="mt-12 relative">
            {/* Zaawansowane wyszukiwanie */}
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-[#35530A] hover:text-[#2D4A06] text-lg font-semibold
                           px-4 py-2 border border-[#35530A] rounded-[2px]
                           transition-colors"
              >
                {showAdvanced
                  ? 'Ukryj zaawansowane wyszukiwanie'
                  : 'Zaawansowane wyszukiwanie'}
              </button>
            </div>

            {/* Pokaż ogłoszenia (po prawej) */}
            <div className="absolute right-0 bottom-0">
              <button
                onClick={handleSearch}
                className="bg-[#35530A] text-white text-lg px-6 py-3
                           rounded-[2px] border border-[#35530A]
                           hover:bg-[#2D4A06] transition-colors font-semibold"
              >
                Pokaż ogłoszenia
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchForm;
