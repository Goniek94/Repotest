import React from 'react';
import FormField from '../components/FormField';

const DescriptionPriceSection = ({ formData, handleChange, errors }) => {
  // Maksymalna długość opisu
  const maxDescriptionLength = 2000;
  
  // Opcje zakupu z ikonami i opisami
  const purchaseOptions = [
    { 
      value: 'sprzedaz', 
      label: 'Sprzedaż',
      description: 'Umowa kupna-sprzedaży'
    },
    { 
      value: 'cesja', 
      label: 'Cesja',
      description: 'Przejęcie leasingu'
    },
    { 
      value: 'zamiana', 
      label: 'Zamiana',
      description: 'Zamiana za inny pojazd'
    },
    { 
      value: 'najem', 
      label: 'Najem',
      description: 'Długoterminowy wynajem'
    }
  ];
  
  // Przedziały cenowe (do filtrowania)
  const priceRanges = [
    { value: 'budget', label: 'Do 15 000 zł', description: 'Pojazdy ekonomiczne' },
    { value: 'standard', label: '15 000 - 50 000 zł', description: 'Standardowy przedział cenowy' },
    { value: 'premium', label: '50 000 - 100 000 zł', description: 'Pojazdy o wyższym standardzie' },
    { value: 'luxury', label: 'Powyżej 100 000 zł', description: 'Pojazdy luksusowe' }
  ];
  
  // Walidacja wartości liczbowych - zapobiega wprowadzaniu wartości ujemnych
  const handleNumberChange = (field, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue >= 0) {
      handleChange(field, value);
    }
  };
  
  // Sprawdzenie czy opcja zakupu jest wybrana
  const isPurchaseOptionSelected = (optionValue) => {
    if (!formData.purchaseOptions) return false;
    return formData.purchaseOptions.includes(optionValue);
  };
  
  // Obsługa zmiany opcji zakupu (checkbox)
  const handlePurchaseOptionChange = (option) => {
    // Inicjalizacja tablicy, jeśli nie istnieje
    const currentOptions = formData.purchaseOptions || [];
    
    // Dodanie lub usunięcie opcji z tablicy
    const newOptions = currentOptions.includes(option)
      ? currentOptions.filter(opt => opt !== option)
      : [...currentOptions, option];
    
    // Aktualizacja stanu
    handleChange('purchaseOptions', newOptions);
  };
  
  // Sprawdzamy czy wybrano opcję najmu (dla wyświetlenia odpowiedniego pola ceny)
  const hasRentalOption = isPurchaseOptionSelected('najem');

  return (
    <div className="bg-white p-6 rounded-[2px] shadow-md">
      {/* Nagłówek główny przeniesiony do komponentu CreateListingForm */}
      
      {/* Sekcja opisu */}
      <div className="mb-8">
        <h3 className="text-white p-2 rounded-[2px] mb-4 bg-[#35530A]">
          Opis pojazdu
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
      <div className="mb-8">
        <h3 className="text-white p-2 rounded-[2px] mb-4 bg-[#35530A]">
          Cena i opcje zakupu
        </h3>
        
        {/* Opcje zakupu jako karty wyboru z checkboxami */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-3">
            Opcje zakupu* (możesz wybrać kilka)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {purchaseOptions.map(option => (
              <div 
                key={option.value}
                className={`
                  border p-4 rounded-[2px] cursor-pointer transition-all hover:shadow-md
                  ${isPurchaseOptionSelected(option.value) 
                    ? 'border-[#35530A] bg-[#F5FAF5]' 
                    : 'border-gray-300'
                  }
                `}
                onClick={() => handlePurchaseOptionChange(option.value)}
              >
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={isPurchaseOptionSelected(option.value)}
                    onChange={() => handlePurchaseOptionChange(option.value)}
                    className="mr-2 accent-[#35530A]"
                  />
                  <span className="font-semibold">{option.label}</span>
                </div>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            ))}
          </div>
          {errors.purchaseOptions && (
            <p className="text-red-500 text-sm mt-1">{errors.purchaseOptions}</p>
          )}
        </div>
        
        {/* Cena z kategoriami cenowymi */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Pole ceny standardowej - zawsze wyświetlane */}
          <FormField
            type="number"
            label="Cena (zł)*"
            name="price"
            value={formData.price}
            onChange={(e) => handleNumberChange('price', e.target.value)}
            error={errors.price}
            min="0"
            placeholder="np. 25000"
            className="md:col-span-2"
          />
          
          {/* Dodatkowe pole dla najmu - wyświetlane tylko gdy wybrano opcję najmu */}
          {hasRentalOption && (
            <FormField
              type="number"
              label="Cena najmu (zł/miesiąc)*"
              name="rentalPrice"
              value={formData.rentalPrice}
              onChange={(e) => handleNumberChange('rentalPrice', e.target.value)}
              error={errors.rentalPrice}
              min="0"
              placeholder="np. 1500"
              className="md:col-span-2"
            />
          )}
          
          {/* Możliwość negocjacji */}
          <div className="md:col-span-2 flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.negotiable === 'Tak'}
                onChange={(e) => handleChange('negotiable', e.target.checked ? 'Tak' : 'Nie')}
                className="mr-2 accent-[#35530A]"
              />
              <span>Cena do negocjacji</span>
            </label>
          </div>
        </div>
        
        {/* Przedział cenowy - pomagający kupującym w wyszukiwaniu */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-3">
            Kategoria cenowa (pomaga w filtrowaniu)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {priceRanges.map(range => (
              <div 
                key={range.value}
                className={`
                  border p-3 rounded-[2px] cursor-pointer transition-all hover:shadow-md
                  ${formData.priceRange === range.value 
                    ? 'border-[#35530A] bg-[#F5FAF5]' 
                    : 'border-gray-300'
                  }
                `}
                onClick={() => handleChange('priceRange', range.value)}
              >
                <div className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.value}
                    checked={formData.priceRange === range.value}
                    onChange={() => handleChange('priceRange', range.value)}
                    className="mr-2 accent-[#35530A]"
                  />
                  <span className="font-semibold">{range.label}</span>
                </div>
                <p className="text-xs text-gray-600">{range.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Informacja końcowa */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-[2px] mt-6">
        <p className="text-[#35530A] text-sm font-medium mb-2">
          To ostatni krok przed podglądem ogłoszenia!
        </p>
        <p className="text-[#35530A] text-sm">
          Po kliknięciu "Przejdź do podglądu" będziesz mógł zobaczyć, jak będzie wyglądało Twoje ogłoszenie.
          Twoje dane są automatycznie zapisywane, więc możesz bezpiecznie przejść do podglądu i wrócić do edycji.
        </p>
      </div>
    </div>
  );
};

export default DescriptionPriceSection;
