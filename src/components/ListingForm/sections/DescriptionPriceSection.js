import React from 'react';
import FormField from '../components/FormField';

const DescriptionPriceSection = ({ formData, handleChange, errors }) => {
  // Maksymalna długość opisu
  const maxDescriptionLength = 2000;
  
  return (
    <div className="bg-white p-6 rounded-[2px] shadow-md">
      <h2 className="text-2xl font-bold mb-6">Opis i cena</h2>
      
      {/* Sekcja opisu */}
      <div className="mb-6">
        <h3 className="text-white p-2 rounded-[2px] mb-2 bg-[#35530A]">
          Dodaj opis*
          {errors.description && (
            <span className="text-red-100 ml-2 text-sm font-normal">
              ({errors.description})
            </span>
          )}
        </h3>
        
        {/* Wskazówki dla opisu */}
        <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] text-[#35530A] p-4 rounded-[2px] mb-4">
          <p className="text-sm">
            W opisie powinny znaleźć się najważniejsze informacje o pojeździe:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm">
            <li>Stan techniczny</li>
            <li>Historia serwisowa</li>
            <li>Wyposażenie dodatkowe</li>
            <li>Ostatnie naprawy</li>
            <li>Informacje o usterkach</li>
          </ul>
        </div>
        
        {/* Pole opisu */}
        <div className={`relative ${errors.description ? 'mb-1' : 'mb-0'}`}>
          <textarea
            rows="8"
            maxLength={maxDescriptionLength}
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Wpisz opis pojazdu..."
            className={`
              w-full border rounded-[2px] p-4 text-gray-700
              focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]
              ${errors.description ? 'border-red-500' : 'border-gray-300'}
            `}
          ></textarea>
          
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
          
          <div className="mt-2 text-sm text-gray-500 text-right">
            {formData.description ? formData.description.length : 0}/{maxDescriptionLength} znaków
          </div>
        </div>
      </div>
      
      {/* Sekcja ceny */}
      <div className="mb-6">
        <h3 className="text-white p-2 rounded-[2px] mb-2 bg-[#35530A]">
          Cena samochodu i opcje zakupu
        </h3>
        
        {/* Opcje zakupu */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Opcje zakupu*
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="purchaseOption"
                value="sprzedaz"
                checked={formData.purchaseOption === 'sprzedaz'}
                onChange={(e) => handleChange('purchaseOption', e.target.value)}
                className="mr-2 accent-[#35530A]"
              />
              <span>Sprzedaż</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="purchaseOption"
                value="cesja"
                checked={formData.purchaseOption === 'cesja'}
                onChange={(e) => handleChange('purchaseOption', e.target.value)}
                className="mr-2 accent-[#35530A]"
              />
              <span>Cesja</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="purchaseOption"
                value="zamiana"
                checked={formData.purchaseOption === 'zamiana'}
                onChange={(e) => handleChange('purchaseOption', e.target.value)}
                className="mr-2 accent-[#35530A]"
              />
              <span>Zamiana</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="purchaseOption"
                value="najem"
                checked={formData.purchaseOption === 'najem'}
                onChange={(e) => handleChange('purchaseOption', e.target.value)}
                className="mr-2 accent-[#35530A]"
              />
              <span>Najem</span>
            </label>
          </div>
        </div>
        
        {/* Cena lub cena najmu w zależności od wybranej opcji */}
        {formData.purchaseOption !== 'najem' ? (
          <FormField
            type="number"
            label="Cena (zł)*"
            name="price"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            error={errors.price}
            min="0"
            placeholder="np. 25000"
          />
        ) : (
          <FormField
            type="number"
            label="Cena najmu (zł/miesiąc)*"
            name="rentalPrice"
            value={formData.rentalPrice}
            onChange={(e) => handleChange('rentalPrice', e.target.value)}
            error={errors.rentalPrice}
            min="0"
            placeholder="np. 1500"
          />
        )}
      </div>
      
      {/* Informacja końcowa */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-[2px] mt-6">
        <p className="text-[#35530A] text-sm font-medium mb-2">
          To ostatni krok przed podglądem ogłoszenia!
        </p>
        <p className="text-[#35530A] text-sm">
          Po kliknięciu "Przejdź do podglądu" będziesz mógł zobaczyć, jak będzie wyglądało Twoje ogłoszenie,
          wybrać jego rodzaj (standardowe lub wyróżnione) oraz dokończyć proces publikacji.
        </p>
      </div>
    </div>
  );
};

export default DescriptionPriceSection;