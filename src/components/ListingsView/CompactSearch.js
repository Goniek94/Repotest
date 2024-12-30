import React, { useState } from 'react';

const carData = {
  Audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8'],
  BMW: ['Seria 1', 'Seria 2', 'Seria 3', 'Seria 4', 'Seria 5', 'Seria 6', 'Seria 7', 'Seria 8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7'],
  Mercedes: ['Klasa A', 'Klasa B', 'Klasa C', 'Klasa E', 'Klasa S', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS'],
  Volkswagen: ['Golf', 'Polo', 'Passat', 'Arteon', 'T-Roc', 'T-Cross', 'Tiguan', 'Touareg', 'ID.3', 'ID.4'],
  Toyota: ['Yaris', 'Corolla', 'Camry', 'RAV4', 'C-HR', 'Highlander', 'Land Cruiser', 'Supra', 'Prius'],
  Ford: ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Puma', 'Edge', 'Mustang', 'Explorer'],
  Opel: ['Corsa', 'Astra', 'Insignia', 'Crossland', 'Grandland', 'Mokka'],
  Hyundai: ['i20', 'i30', 'i40', 'Kona', 'Tucson', 'Santa Fe', 'IONIQ', 'NEXO'],
  Kia: ['Picanto', 'Rio', 'Ceed', 'Proceed', 'Stinger', 'XCeed', 'Sportage', 'Sorento'],
  Škoda: ['Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq'],
};

const bodyTypes = ['Sedan', 'Hatchback', 'SUV', 'Kombi', 'Coupé', 'Cabrio', 'VAN', 'Pickup'];
const fuelTypes = ['Benzyna', 'Diesel', 'Elektryczny', 'Hybrydowy'];
const damageStatuses = ['Udziałowy', 'Nieszkodliwy', 'Po stłuczce', 'Inne'];
const countries = ['Polska', 'Inne'];
const colors = ['Czarny', 'Biały', 'Srebrny', 'Czerwony', 'Niebieski', 'Inne'];
const doorCounts = ['2', '4/5'];
const gearboxes = ['Manualna', 'Automatyczna'];
const driveTypes = ['TVI', 'Przód', '4x4'];

const CompactSearch = () => {
  const [formData, setFormData] = useState({
    bodyType: '',
    make: '',
    model: '',
    generation: '',
    fuelType: '',
    priceFrom: '',
    priceTo: '',
    yearFrom: '',
    yearTo: '',
    mileageFrom: '',
    mileageTo: '',
    powerFrom: '',
    powerTo: '',
    engineCapacityFrom: '',
    engineCapacityTo: '',
    location: '',
    damageStatus: '',
    country: '',
    color: '',
    doorCount: '',
    gearbox: '',
    driveType: '',
  });

  const [availableModels, setAvailableModels] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'make') {
      setAvailableModels(carData[value] || []);
      setFormData((prev) => ({ ...prev, model: '', generation: '' }));
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);
  };

  const handleSearch = () => {
    console.log('Parametry wyszukiwania:', formData);
    // Tutaj możesz dodać logikę wysyłania danych do API
  };

  return (
    <div
      className="relative max-w-6xl w-full rounded-lg shadow-lg p-6"
      style={{
        backgroundImage: "url('/images/auto-788747_1280.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
      <div className="relative z-10 bg-transparent p-6 rounded-lg">
        {/* Główne filtry wyszukiwania */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Nadwozie */}
          <div>
            <label className="block text-sm font-medium text-white">Nadwozie</label>
            <select
              name="bodyType"
              value={formData.bodyType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Wybierz nadwozie</option>
              {bodyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Marka */}
          <div>
            <label className="block text-sm font-medium text-white">Marka</label>
            <select
              name="make"
              value={formData.make}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
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
            <label className="block text-sm font-medium text-white">Model</label>
            <select
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              disabled={!formData.make}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Wybierz model</option>
              {availableModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Generacja */}
          <div>
            <label className="block text-sm font-medium text-white">Generacja</label>
            <input
              type="text"
              name="generation"
              value={formData.generation}
              onChange={handleInputChange}
              placeholder="Wpisz generację"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Rodzaj paliwa */}
          <div>
            <label className="block text-sm font-medium text-white">Rodzaj paliwa</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Wybierz paliwo</option>
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div>

          {/* Cena od */}
          <div>
            <label className="block text-sm font-medium text-white">Cena od (PLN)</label>
            <input
              type="number"
              name="priceFrom"
              value={formData.priceFrom}
              onChange={handleInputChange}
              placeholder="Od"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Cena do */}
          <div>
            <label className="block text-sm font-medium text-white">Cena do (PLN)</label>
            <input
              type="number"
              name="priceTo"
              value={formData.priceTo}
              onChange={handleInputChange}
              placeholder="Do"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Rocznik od */}
          <div>
            <label className="block text-sm font-medium text-white">Rocznik od</label>
            <select
              name="yearFrom"
              value={formData.yearFrom}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Od</option>
              {generateYearOptions().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Rocznik do */}
          <div>
            <label className="block text-sm font-medium text-white">Rocznik do</label>
            <select
              name="yearTo"
              value={formData.yearTo}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Do</option>
              {generateYearOptions().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Przebieg od */}
          <div>
            <label className="block text-sm font-medium text-white">Przebieg od (km)</label>
            <input
              type="number"
              name="mileageFrom"
              value={formData.mileageFrom}
              onChange={handleInputChange}
              placeholder="Od"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Przebieg do */}
          <div>
            <label className="block text-sm font-medium text-white">Przebieg do (km)</label>
            <input
              type="number"
              name="mileageTo"
              value={formData.mileageTo}
              onChange={handleInputChange}
              placeholder="Do"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Moc od */}
          <div>
            <label className="block text-sm font-medium text-white">Moc od (KM)</label>
            <input
              type="number"
              name="powerFrom"
              value={formData.powerFrom}
              onChange={handleInputChange}
              placeholder="Od"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Moc do */}
          <div>
            <label className="block text-sm font-medium text-white">Moc do (KM)</label>
            <input
              type="number"
              name="powerTo"
              value={formData.powerTo}
              onChange={handleInputChange}
              placeholder="Do"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Pojemność od */}
          <div>
            <label className="block text-sm font-medium text-white">Pojemność od (cm³)</label>
            <input
              type="number"
              name="engineCapacityFrom"
              value={formData.engineCapacityFrom}
              onChange={handleInputChange}
              placeholder="Od"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Pojemność do */}
          <div>
            <label className="block text-sm font-medium text-white">Pojemność do (cm³)</label>
            <input
              type="number"
              name="engineCapacityTo"
              value={formData.engineCapacityTo}
              onChange={handleInputChange}
              placeholder="Do"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Lokalizacja */}
          <div>
            <label className="block text-sm font-medium text-white">Lokalizacja</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Miasto, województwo"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Stan */}
          <div>
            <label className="block text-sm font-medium text-white">Stan</label>
            <select
              name="damageStatus"
              value={formData.damageStatus}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Wybierz stan</option>
              {damageStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Kraj pochodzenia */}
          <div>
            <label className="block text-sm font-medium text-white">Kraj pochodzenia</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Wybierz kraj</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Kolor */}
          <div>
            <label className="block text-sm font-medium text-white">Kolor</label>
            <select
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Wybierz kolor</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          {/* Liczba drzwi */}
          <div>
            <label className="block text-sm font-medium text-white">Liczba drzwi</label>
            <select
              name="doorCount"
              value={formData.doorCount}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Wybierz</option>
              {doorCounts.map((count) => (
                <option key={count} value={count}>
                  {count}D
                </option>
              ))}
            </select>
          </div>

          {/* Skrzynia biegów */}
          <div>
            <label className="block text-sm font-medium text-white">Skrzynia biegów</label>
            <select
              name="gearbox"
              value={formData.gearbox}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Wybierz skrzynię</option>
              {gearboxes.map((gearbox) => (
                <option key={gearbox} value={gearbox}>
                  {gearbox}
                </option>
              ))}
            </select>
          </div>

          {/* Napęd */}
          <div>
            <label className="block text-sm font-medium text-white">Napęd</label>
            <select
              name="driveType"
              value={formData.driveType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Wybierz napęd</option>
              {driveTypes.map((drive) => (
                <option key={drive} value={drive}>
                  {drive}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Przycisk Wyszukaj */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white text-lg px-6 py-3 rounded hover:bg-green-700"
          >
            Wyszukaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompactSearch;
