import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCarData from '../../search/hooks/useCarData';
import { bodyTypes, advancedOptions, regions } from '../../search/SearchFormConstants';

export default function SearchForm({ initialValues = {} }) {
  const navigate = useNavigate();
  
  // Pobierz dane o markach i modelach z hooka useCarData
  const { carData, brands, getModelsForBrand, loading } = useCarData();

  // Dane formularza
  const [formData, setFormData] = useState(() => ({
    make: '',
    model: '',
    priceFrom: '',
    priceTo: '',
    yearFrom: '',
    yearTo: '',
    bodyType: '',
    damageStatus: '',
    country: '',
    region: '',
    fuelType: '',
    driveType: '',
    mileageFrom: '',
    mileageTo: '',
    location: '',
    transmission: '',
    enginePowerFrom: '',
    enginePowerTo: '',
    engineCapacityFrom: '',
    engineCapacityTo: '',
    color: '',
    doorCount: '',
    tuning: '',
    vehicleCondition: '',
    sellingForm: '',
    sellerType: '',
    vat: false,
    invoiceOptions: false,
    ...initialValues
  }));

  // Lista dostępnych modeli dla wybranej marki
  const [availableModels, setAvailableModels] = useState([]);

  // Czy pokazywać zaawansowane filtry
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sztuczna liczba pasujących ogłoszeń
  const [matchingResults, setMatchingResults] = useState(1834);

  // Funkcja obliczająca „liczbę pasujących" ogłoszeń (przykładowe założenie)
  const calculateMatchingResults = (currentFormData) => {
    let baseCount = 1834;
    Object.keys(currentFormData).forEach(key => {
      if (currentFormData[key] && typeof currentFormData[key] !== 'boolean') {
        baseCount = Math.floor(baseCount * 0.9);
      } else if (currentFormData[key] === true) {
        baseCount = Math.floor(baseCount * 0.95);
      }
    });
    return Math.max(baseCount, 10); // Minimum 10 ogłoszeń
  };

  // Aktualizuj dostępne modele na podstawie wybranej marki
  useEffect(() => {
    const fetchModels = async () => {
      if (formData.make) {
        const models = await getModelsForBrand(formData.make);
        setAvailableModels(models);
      } else {
        setAvailableModels([]);
      }
    };
    
    fetchModels();
  }, [formData.make, getModelsForBrand]);

  // Przeliczaj „wynik" przy każdej zmianie formData
  useEffect(() => {
    const newCount = calculateMatchingResults(formData);
    setMatchingResults(newCount);
  }, [formData]);

  // Generuj listę roczników wstecz (np. od 1990)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);
  };

  // Obsługa zmian w polach formularza
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      // Nie pozwalamy na wartości ujemne w polach numerycznych
      let finalValue = value;
      if (['priceFrom', 'priceTo', 'mileageFrom', 'mileageTo', 'enginePowerFrom', 'enginePowerTo', 'engineCapacityFrom', 'engineCapacityTo'].includes(name)) {
        if (Number(value) < 0) finalValue = 0;
      }
      
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    }
  };

  // Obsługa przycisku "Pokaż ogłoszenia"
  const handleSearch = () => {
    // Budowanie parametrów URL z formularza
    const searchParams = new URLSearchParams();
    
    // Dodaj tylko niepuste wartości do parametrów URL
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        // Konwertuj wartości boolowskie na stringi
        if (typeof value === 'boolean') {
          searchParams.append(key, value.toString());
        } else {
          searchParams.append(key, value);
        }
      }
    });
    
    // Przekieruj na stronę wyników z parametrami
    navigate(`/listings?${searchParams.toString()}`);
  };

  return (
    <section className="bg-[#F5F7F9] py-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#35530A] text-center mb-5 uppercase">
          Wyszukaj pojazd
        </h2>

        {/* PODSTAWOWE FILTRY */}
        <div className="bg-white p-5 shadow-md rounded-[2px] mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
            {/* RZĄD 1 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nadwozie
              </label>
              <select
                name="bodyType"
                value={formData.bodyType}
                onChange={handleInputChange}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
              >
                <option value="">Wybierz typ nadwozia</option>
                {bodyTypes.map((body) => (
                  <option key={body} value={body}>
                    {body}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Marka
              </label>
              <select
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
              >
                <option value="">Wybierz markę</option>
                {brands.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Model
              </label>
              <select
                name="model"
                value={formData.model}
                disabled={!formData.make}
                onChange={handleInputChange}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] disabled:bg-gray-100"
              >
                <option value="">Wybierz model</option>
                {availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Generacja (rocznik)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  name="yearFrom"
                  value={formData.yearFrom}
                  onChange={handleInputChange}
                  className="w-full h-10 text-sm px-2 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                >
                  <option value="">Od</option>
                  {generateYearOptions().map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                <select
                  name="yearTo"
                  value={formData.yearTo}
                  onChange={handleInputChange}
                  className="w-full h-10 text-sm px-2 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                >
                  <option value="">Do</option>
                  {generateYearOptions().map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* RZĄD 2 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Cena
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="priceFrom"
                  placeholder="Od"
                  min="0"
                  value={formData.priceFrom}
                  onChange={handleInputChange}
                  className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                />
                <input
                  type="number"
                  name="priceTo"
                  placeholder="Do"
                  min="0"
                  value={formData.priceTo}
                  onChange={handleInputChange}
                  className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Rocznik
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="yearFrom"
                  placeholder="Od"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.yearFrom}
                  onChange={handleInputChange}
                  className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                />
                <input
                  type="number"
                  name="yearTo"
                  placeholder="Do"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.yearTo}
                  onChange={handleInputChange}
                  className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Przebieg
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="mileageFrom"
                  placeholder="Od"
                  min="0"
                  value={formData.mileageFrom}
                  onChange={handleInputChange}
                  className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                />
                <input
                  type="number"
                  name="mileageTo"
                  placeholder="Do"
                  min="0"
                  value={formData.mileageTo}
                  onChange={handleInputChange}
                  className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Rodzaj paliwa
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
              >
                <option value="">Wybierz rodzaj paliwa</option>
                {advancedOptions.fuelType.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ZAAWANSOWANE FILTRY */}
          {showAdvanced && (
            <>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3">Silnik i napęd</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                  {/* Moc */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Moc
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        name="enginePowerFrom"
                        placeholder="Od"
                        min="0"
                        value={formData.enginePowerFrom}
                        onChange={handleInputChange}
                        className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                      />
                      <input
                        type="number"
                        name="enginePowerTo"
                        placeholder="Do"
                        min="0"
                        value={formData.enginePowerTo}
                        onChange={handleInputChange}
                        className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                      />
                    </div>
                  </div>

                  {/* Pojemność */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Pojemność
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        name="engineCapacityFrom"
                        placeholder="Od"
                        min="0"
                        value={formData.engineCapacityFrom}
                        onChange={handleInputChange}
                        className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                      />
                      <input
                        type="number"
                        name="engineCapacityTo"
                        placeholder="Do"
                        min="0"
                        value={formData.engineCapacityTo}
                        onChange={handleInputChange}
                        className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                      />
                    </div>
                  </div>

                  {/* Skrzynia */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Skrzynia
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {advancedOptions.transmission.map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            type="radio"
                            id={`transmission-${type}`}
                            name="transmission"
                            value={type}
                            checked={formData.transmission === type}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <label htmlFor={`transmission-${type}`} className="text-sm">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Napęd */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Napęd
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {advancedOptions.driveType.slice(0, 3).map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            type="radio"
                            id={`drive-${type}`}
                            name="driveType"
                            value={type}
                            checked={formData.driveType === type}
                            onChange={handleInputChange}
                            className="mr-1"
                          />
                          <label htmlFor={`drive-${type}`} className="text-xs">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-700 mt-5 mb-3">Forma sprzedaży i lokalizacja</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                  {/* Kraj pochodzenia */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Kraj pochodzenia
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                    >
                      <option value="">Wybierz kraj</option>
                      {advancedOptions.country.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Województwo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Województwo
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                    >
                      <option value="">Wybierz województwo</option>
                      {regions.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Forma sprzedaży */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Forma sprzedaży
                    </label>
                    <select
                      name="sellingForm"
                      value={formData.sellingForm}
                      onChange={handleInputChange}
                      className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                    >
                      <option value="">Wybierz formę</option>
                      {advancedOptions.sellingForm.map((form) => (
                        <option key={form} value={form}>
                          {form}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sprzedawca */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Sprzedawca
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {advancedOptions.sellerType.map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            type="radio"
                            id={`seller-${type}`}
                            name="sellerType"
                            value={type}
                            checked={formData.sellerType === type}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <label htmlFor={`seller-${type}`} className="text-sm">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 mt-4 rounded-[2px]">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="vat"
                        name="vat"
                        checked={formData.vat}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="vat" className="text-sm font-medium">FV 23%</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="invoiceOptions"
                        name="invoiceOptions"
                        checked={formData.invoiceOptions}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="invoiceOptions" className="text-sm font-medium">Możliwość faktura/paragon</label>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-700 mt-5 mb-3">Nadwozie</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                  {/* Stan uszkodzeń */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Stan uszkodzeń
                    </label>
                    <select
                      name="damageStatus"
                      value={formData.damageStatus}
                      onChange={handleInputChange}
                      className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                    >
                      <option value="">Wybierz stan</option>
                      {advancedOptions.damageStatus.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bezwypadkowy */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Bezwypadkowy
                    </label>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="accident-yes"
                          name="vehicleStatus"
                          value="Bezwypadkowy"
                          checked={formData.vehicleStatus === "Bezwypadkowy"}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <label htmlFor="accident-yes" className="text-sm">Tak</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="accident-no"
                          name="vehicleStatus"
                          value="Uszkodzony"
                          checked={formData.vehicleStatus === "Uszkodzony"}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <label htmlFor="accident-no" className="text-sm">Nie</label>
                      </div>
                    </div>
                  </div>

                  {/* Kierownica po prawej */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Kierownica po prawej
                    </label>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="rightSteering-yes"
                          name="vehicleStatus"
                          value="Kierownica po prawej"
                          checked={formData.vehicleStatus === "Kierownica po prawej"}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <label htmlFor="rightSteering-yes" className="text-sm">Tak</label>
                      </div>
                      <div className="flex items-center"><input
                          type="radio"
                          id="rightSteering-no"
                          name="vehicleStatus"
                          value=""
                          checked={!formData.vehicleStatus || (formData.vehicleStatus !== "Kierownica po prawej")}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <label htmlFor="rightSteering-no" className="text-sm">Nie</label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dla niepełnosprawnych */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Przystosowany dla niepełnosprawnych
                    </label>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="disabled-yes"
                          name="vehicleStatus"
                          value="Przystosowany dla niepełnosprawnych"
                          checked={formData.vehicleStatus === "Przystosowany dla niepełnosprawnych"}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <label htmlFor="disabled-yes" className="text-sm">Tak</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="disabled-no"
                          name="vehicleStatus"
                          value=""
                          checked={!formData.vehicleStatus || (formData.vehicleStatus !== "Przystosowany dla niepełnosprawnych")}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <label htmlFor="disabled-no" className="text-sm">Nie</label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Kolor */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Kolor
                    </label>
                    <select
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
                    >
                      <option value="">Wybierz kolor</option>
                      {advancedOptions.color.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Liczba drzwi */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Liczba drzwi
                    </label>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      {advancedOptions.doorCount.map((count) => (
                        <div key={count} className="flex items-center">
                          <input
                            type="radio"
                            id={`doors-${count}`}
                            name="doorCount"
                            value={count}
                            checked={formData.doorCount === count}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <label htmlFor={`doors-${count}`} className="text-sm">
                            {count}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tuning */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Tuning
                    </label>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      {advancedOptions.tuning.map((option) => (
                        <div key={option} className="flex items-center">
                          <input
                            type="radio"
                            id={`tuning-${option}`}
                            name="tuning"
                            value={option}
                            checked={formData.tuning === option}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <label htmlFor={`tuning-${option}`} className="text-sm">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* DOLNA SEKCJA PRZYCISKÓW */}
          <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-4">
            {/* Przycisk / link „Zaawansowane" */}
            <button
              type="button"
              className="text-[#35530A] text-sm uppercase font-semibold
                         border border-transparent hover:border-[#35530A]
                         hover:bg-white hover:underline
                         px-2 py-1 transition-colors rounded-[2px]"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Ukryj zaawansowane' : 'Zaawansowane ▼'}
            </button>

            {/* Główny przycisk – Pokaż ogłoszenia */}
            <button
              type="button"
              onClick={handleSearch}
              className="bg-[#35530A] text-white rounded-[2px] px-6 py-2
                         text-sm font-bold uppercase hover:bg-[#2D4A06]
                         transition-colors"
            >
              Pokaż ogłoszenia
              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-[2px]">
                ({matchingResults})
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
