// CreateListing.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoUpload from './PhotoUpload';

const CreateListing = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    headline: '',
    vin: '',
    registrationNumber: '',
    condition: '',         // Nowy / Używany
    accidentStatus: '',    // Bezwypadkowy / Powypadkowy
    damageStatus: '',      // Nieuszkodzony / Uszkodzony
    tuning: '',            // Tak / Nie
    imported: '',          // Tak / Nie
    registeredInPL: '',    // Tak / Nie
    firstOwner: '',        // Tak / Nie
    disabledAdapted: '',   // Tak / Nie
    bodyType: '',
    color: '',
    productionYear: '',
    mileage: '',
    lastOfficialMileage: '',
    countryOfOrigin: '',
    brand: '',
    model: '',
    generation: '',
    version: '',
    fuelType: '',
    power: '',
    engineSize: '',
    transmission: '',
    drive: '',
    doors: '',
    weight: '',
    voivodeship: '',
    city: '',
    photos: []
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVinSearch = () => {
    console.log('Szukanie VIN:', formData.vin);
  };

  const handlePhotosChange = (photos) => {
    setFormData((prev) => ({
      ...prev,
      photos
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dane do wysłania:', formData);
    // navigate('/thanks');
  };

  return (
    <div className="min-h-screen py-6" style={{ backgroundColor: '#FCFCFC' }}>
      {/* Poszerzona szerokość kontenera */}
      <div className="max-w-5xl mx-auto px-4">
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-lg shadow mb-8"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {/* WYSZUKIWANIE VIN */}
          <div className="mb-6">
            <h3
              className="text-white p-2 rounded mb-2"
              style={{ backgroundColor: '#35530A' }}
            >
              Wyszukaj samochód po numerze VIN lub numerze rejestracyjnym
            </h3>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.vin}
                onChange={(e) => handleChange('vin', e.target.value)}
                placeholder="Wprowadź numer VIN lub numer rejestracyjny"
                className="flex-1 p-2 border rounded"
                style={{ borderColor: '#ccc' }}
              />
              <button
                type="button"
                onClick={handleVinSearch}
                className="text-white px-4 py-2 rounded"
                style={{ backgroundColor: '#35530A' }}
              >
                Pobierz Dane
              </button>
            </div>
          </div>

          {/* TYTUŁ */}
          <div className="mb-6">
            <input
              type="text"
              disabled
              value={formData.title}
              placeholder="Automatyczne uzupełnianie: marka, model, generacja, wersja"
              className="w-full p-2 border rounded bg-gray-50"
              style={{ borderColor: '#ccc' }}
            />
          </div>

          {/* NAGŁÓWEK */}
          <div className="mb-6 flex items-center gap-3">
            <label className="w-40 font-bold">Nagłówek:</label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              maxLength={60}
              placeholder="(Max 60 znaków)"
              className="flex-1 p-2 border rounded"
              style={{ borderColor: '#ccc' }}
            />
          </div>

          {/* STAN POJAZDU */}
          <div className="mb-8">
            <h3
              className="text-white p-2 rounded mb-4"
              style={{ backgroundColor: '#35530A' }}
            >
              Stan pojazdu:
            </h3>

            {/* PIERWSZY WIERSZ (3 kolumny) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Kolumna 1: Stan, Wypadkowość */}
              <div>
                {/* Stan */}
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Stan:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="condition"
                        value="Nowy"
                        checked={formData.condition === 'Nowy'}
                        onChange={(e) => handleChange('condition', e.target.value)}
                        style={{ accentColor: '#35530A' }}
                      />
                      <span>Nowy</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="condition"
                        value="Używany"
                        checked={formData.condition === 'Używany'}
                        onChange={(e) => handleChange('condition', e.target.value)}
                        style={{ accentColor: '#35530A' }}
                      />
                      <span>Używany</span>
                    </label>
                  </div>
                </div>

                {/* Wypadkowość */}
                <div>
                  <label className="block font-semibold mb-1">Wypadkowość:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="accidentStatus"
                        value="Bezwypadkowy"
                        checked={formData.accidentStatus === 'Bezwypadkowy'}
                        onChange={(e) =>
                          handleChange('accidentStatus', e.target.value)
                        }
                        style={{ accentColor: '#35530A' }}
                      />
                      <span>Bezwypadkowy</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="accidentStatus"
                        value="Powypadkowy"
                        checked={formData.accidentStatus === 'Powypadkowy'}
                        onChange={(e) =>
                          handleChange('accidentStatus', e.target.value)
                        }
                        style={{ accentColor: '#35530A' }}
                      />
                      <span>Powypadkowy</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Kolumna 2: Uszkodzenia, Tuning */}
              <div>
                {/* Uszkodzenia */}
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Uszkodzenia:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="damageStatus"
                        value="Nieuszkodzony"
                        checked={formData.damageStatus === 'Nieuszkodzony'}
                        onChange={(e) =>
                          handleChange('damageStatus', e.target.value)
                        }
                        style={{ accentColor: '#35530A' }}
                      />
                      <span>Nieuszkodzony</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="damageStatus"
                        value="Uszkodzony"
                        checked={formData.damageStatus === 'Uszkodzony'}
                        onChange={(e) =>
                          handleChange('damageStatus', e.target.value)
                        }
                        style={{ accentColor: '#35530A' }}
                      />
                      <span>Uszkodzony</span>
                    </label>
                  </div>
                </div>

                {/* Tuning */}
                <div>
                  <label className="block font-semibold mb-1">Tuning:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="tuning"
                        value="Tak"
                        checked={formData.tuning === 'Tak'}
                        onChange={(e) => handleChange('tuning', e.target.value)}
                        style={{ accentColor: '#35530A' }}
                      />
                      <span>Tak</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="tuning"
                        value="Nie"
                        checked={formData.tuning === 'Nie'}
                        onChange={(e) => handleChange('tuning', e.target.value)}
                        style={{ accentColor: '#35530A' }}
                      />
                      <span>Nie</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Kolumna 3: Importowany, Zarejestrowany w PL */}
              <div>
                {/* Importowany */}
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Importowany:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="imported"
                        value="Tak"
                        checked={formData.imported === 'Tak'}
                        onChange={(e) => handleChange('imported', e.target.value)}
                        style={{ accentColor: '#35530A' }}
                      />
                      <span>Tak</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="imported"
                        value="Nie"
                        checked={formData.imported === 'Nie'}
                        onChange={(e) => handleChange('imported', e.target.value)}
                        style={{ accentColor: '#35530A' }}
                      />
                      <span>Nie</span>
                    </label>
                  </div>
                </div>

                {/* Zarejestrowany w PL */}
                <div>
                  <label className="block font-semibold mb-1">
                    Zarejestrowany w PL:
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="registeredInPL"
                        value="Tak"
                        checked={formData.registeredInPL === 'Tak'}
                        onChange={(e) =>
                          handleChange('registeredInPL', e.target.value)
                        }
                        style={{ accentColor: '#35530A' }}
                      />
                      <span>Tak</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="registeredInPL"
                        value="Nie"
                        checked={formData.registeredInPL === 'Nie'}
                        onChange={(e) =>
                          handleChange('registeredInPL', e.target.value)
                        }
                        style={{ accentColor: '#35530A' }}
                      />
                      <span>Nie</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* DRUGI WIERSZ (3 kolumny) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pierwszy właściciel */}
              <div>
                <label className="block font-semibold mb-1">
                  Pierwszy właściciel:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="firstOwner"
                      value="Tak"
                      checked={formData.firstOwner === 'Tak'}
                      onChange={(e) => handleChange('firstOwner', e.target.value)}
                      style={{ accentColor: '#35530A' }}
                    />
                    <span>Tak</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="firstOwner"
                      value="Nie"
                      checked={formData.firstOwner === 'Nie'}
                      onChange={(e) => handleChange('firstOwner', e.target.value)}
                      style={{ accentColor: '#35530A' }}
                    />
                    <span>Nie</span>
                  </label>
                </div>
              </div>

              {/* Dla niepełnosprawnych */}
              <div>
                <label className="block font-semibold mb-1">
                  Dla niepełnosprawnych:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="disabledAdapted"
                      value="Tak"
                      checked={formData.disabledAdapted === 'Tak'}
                      onChange={(e) =>
                        handleChange('disabledAdapted', e.target.value)
                      }
                      style={{ accentColor: '#35530A' }}
                    />
                    <span>Tak</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="disabledAdapted"
                      value="Nie"
                      checked={formData.disabledAdapted === 'Nie'}
                      onChange={(e) =>
                        handleChange('disabledAdapted', e.target.value)
                      }
                      style={{ accentColor: '#35530A' }}
                    />
                    <span>Nie</span>
                  </label>
                </div>
              </div>

              {/* Wolne miejsce na kolejne pola */}
              <div>
                {/* Możesz coś tu dodać */}
              </div>
            </div>
          </div>

          {/* NADWOZIE */}
          <div className="mb-6">
            <h3
              className="text-white p-2 rounded mb-2"
              style={{ backgroundColor: '#35530A' }}
            >
              Nadwozie
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                'Hatchback',
                'Sedan',
                'Kombi',
                'SUV',
                'Coupe',
                'Cabrio',
                'Terenowe',
                'Minivan',
                'Dostawcze'
              ].map((type) => (
                <label key={type} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="bodyType"
                    value={type}
                    checked={formData.bodyType === type}
                    onChange={(e) => handleChange('bodyType', e.target.value)}
                    style={{ accentColor: '#35530A' }}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* KOLOR */}
          <div className="mb-6">
            <label className="block mb-1 font-bold">Kolor</label>
            <div className="flex items-center gap-3">
              <span>Wybierz:</span>
              <select
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-60 p-2 border rounded"
                style={{ borderColor: '#ccc' }}
              >
                <option value="">---</option>
                {[
                  'Czarny',
                  'Biały',
                  'Srebrny',
                  'Czerwony',
                  'Niebieski',
                  'Zielony',
                  'Żółty',
                  'Brązowy',
                  'Złoty',
                  'Szary',
                  'Inny'
                ].map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DANE TECHNICZNE */}
          <div className="mb-6">
            <h3
              className="text-white p-2 rounded mb-2"
              style={{ backgroundColor: '#35530A' }}
            >
              Dane techniczne
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {/* Rok produkcji */}
              <div>
                <label className="block mb-1 font-bold">Rok produkcji</label>
                <input
                  type="number"
                  min="1900"
                  value={formData.productionYear}
                  onChange={(e) => handleChange('productionYear', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                />
              </div>

              {/* Przebieg */}
              <div>
                <label className="block mb-1 font-bold">Przebieg</label>
                <input
                  type="number"
                  min="0"
                  value={formData.mileage}
                  onChange={(e) => handleChange('mileage', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                />
              </div>

              {/* Ostatni przebieg (CEPiK) */}
              <div>
                <label className="block mb-1 font-bold">
                  Ostatni przebieg (CEPiK)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.lastOfficialMileage}
                  onChange={(e) =>
                    handleChange('lastOfficialMileage', e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                />
              </div>

              {/* Kraj pochodzenia */}
              <div>
                <label className="block mb-1 font-bold">Kraj pochodzenia</label>
                <input
                  type="text"
                  value={formData.countryOfOrigin}
                  onChange={(e) =>
                    handleChange('countryOfOrigin', e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                />
              </div>

              {/* Marka */}
              <div>
                <label className="block mb-1 font-bold">Marka*</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                />
              </div>

              {/* Model */}
              <div>
                <label className="block mb-1 font-bold">Model*</label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                />
              </div>

              {/* Generacja */}
              <div>
                <label className="block mb-1 font-bold">Generacja*</label>
                <input
                  type="text"
                  required
                  value={formData.generation}
                  onChange={(e) => handleChange('generation', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                />
              </div>

              {/* Wersja */}
              <div>
                <label className="block mb-1 font-bold">Wersja*</label>
                <input
                  type="text"
                  required
                  value={formData.version}
                  onChange={(e) => handleChange('version', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                />
              </div>

              {/* Rodzaj paliwa */}
              <div>
                <label className="block mb-1 font-bold">Rodzaj paliwa*</label>
                <select
                  required
                  value={formData.fuelType}
                  onChange={(e) => handleChange('fuelType', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                >
                  <option value="">---</option>
                  <option value="Benzyna">Benzyna</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Benzyna+LPG">Benzyna+LPG</option>
                  <option value="Elektryczny">Elektryczny</option>
                  <option value="Hybryda">Hybryda</option>
                </select>
              </div>

              {/* Moc (KM) */}
              <div>
                <label className="block mb-1 font-bold">Moc* (KM)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.power}
                  onChange={(e) => handleChange('power', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                />
              </div>

              {/* Pojemność silnika (cm³) */}
              <div>
                <label className="block mb-1 font-bold">Pojemność* (cm³)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.engineSize}
                  onChange={(e) => handleChange('engineSize', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                />
              </div>

              {/* Skrzynia biegów */}
              <div>
                <label className="block mb-1 font-bold">Skrzynia biegów*</label>
                <select
                  required
                  value={formData.transmission}
                  onChange={(e) => handleChange('transmission', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                >
                  <option value="">---</option>
                  <option value="Manualna">Manualna</option>
                  <option value="Automatyczna">Automatyczna</option>
                  <option value="Automatyczna">Półautomatyczna</option>
                </select>
              </div>

              {/* Napęd */}
              <div>
                <label className="block mb-1 font-bold">Napęd*</label>
                <select
                  required
                  value={formData.drive}
                  onChange={(e) => handleChange('drive', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                >
                  <option value="">---</option>
                  <option value="Przedni">Przedni</option>
                  <option value="Tylny">Tylny</option>
                  <option value="4x4">4x4</option>
                </select>
              </div>

              {/* Liczba drzwi */} 
              <div>
                <label className="block mb-1 font-bold">Liczba drzwi*</label>
                <input
                  type="number"
                  required
                  min="2"
                  max="5"
                  value={formData.doors}
                  onChange={(e) => handleChange('doors', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                />
              </div>

              {/* Waga samochodu */}
              <div>
                <label className="block mb-1 font-bold">Waga (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                />
              </div>
            </div>
          </div>

          {/* LOKALIZACJA */}
          <div className="mb-6">
            <h3
              className="text-white p-2 rounded mb-2"
              style={{ backgroundColor: '#35530A' }}
            >
              Lokalizacja:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-bold">Województwo</label>
                <select
                  value={formData.voivodeship}
                  onChange={(e) => handleChange('voivodeship', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                >
                  <option value="">---</option>
                  {[
                    'Dolnośląskie',
                    'Kujawsko-pomorskie',
                    'Lubelskie',
                    'Lubuskie',
                    'Łódzkie',
                    'Małopolskie',
                    'Mazowieckie',
                    'Opolskie',
                    'Podkarpackie',
                    'Podlaskie',
                    'Pomorskie',
                    'Śląskie',
                    'Świętokrzyskie',
                    'Warmińsko-mazurskie',
                    'Wielkopolskie',
                    'Zachodniopomorskie'
                  ].map((woj) => (
                    <option key={woj} value={woj}>
                      {woj}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-bold">Miejscowość</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#ccc' }}
                />
              </div>
            </div>
          </div>

          {/* PRZYCISK ZAPISU */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="text-white px-4 py-2 rounded"
              style={{ backgroundColor: '#35530A' }}
            >
              Zapisz
            </button>
          </div>
        </form>

        {/* SEKCJA ZDJĘĆ */}
        <div
          className="p-6 rounded-lg shadow"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <PhotoUpload
            photos={formData.photos}
            onPhotosChange={handlePhotosChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
