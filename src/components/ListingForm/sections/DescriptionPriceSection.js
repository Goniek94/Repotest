import React from 'react';
import FormField from '../components/FormField';
import { FileText } from 'lucide-react';

const DescriptionPriceSection = ({ formData, handleChange, errors }) => {
  // Maksymalna długość opisu
  const maxDescriptionLength = 2000;
  
  // Opcje zakupu z ikonami i opisami - dostosowane do wartości oczekiwanych przez backend
  const purchaseOptions = [
    { 
      value: 'umowa kupna-sprzedaży', 
      label: 'Sprzedaż',
      description: 'Umowa kupna-sprzedaży'
    },
    { 
      value: 'faktura VAT', 
      label: 'Faktura VAT',
      description: 'Sprzedaż z fakturą VAT'
    },
    { 
      value: 'inne', 
      label: 'Inne',
      description: 'Inna forma zakupu (np. cesja, zamiana, najem)'
    }
  ];
  
  
  // Walidacja wartości liczbowych - zapobiega wprowadzaniu wartości ujemnych
  const handleNumberChange = (field, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue >= 0) {
      handleChange(field, value);
    }
  };
  
  // Obsługa zmiany opcji zakupu (radio button)
  const handlePurchaseOptionChange = (option) => {
    // Aktualizacja stanu - pojedyncza wartość zamiast tablicy
    handleChange('purchaseOptions', option);
    
    // Jeśli wybrano opcję "inne", dodajemy też pole purchaseOption dla kompatybilności
    handleChange('purchaseOption', option === 'inne' ? 'najem' : 'sprzedaz');
  };
  
  // Sprawdzamy czy wybrano opcję najmu (dla wyświetlenia odpowiedniego pola ceny)
  const hasRentalOption = formData.purchaseOption === 'najem' || formData.purchaseOptions === 'inne';

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white">
      {/* Jedna główna karta - kompaktowa */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header karty */}
        <div className="bg-gradient-to-r from-[#35530A] to-[#2D4A06] text-white p-4">
          <div className="flex items-center">
            <FileText className="h-6 w-6 mr-3" />
            <div>
              <h2 className="text-xl font-bold">Opis i cena</h2>
              <p className="text-green-100 text-sm">Szczegóły i warunki sprzedaży</p>
            </div>
          </div>
        </div>

        {/* Zawartość karty */}
        <div className="p-6 space-y-6">
      
      {/* Sekcja opisu */}
      <div className="mb-6">
        {/* Pole opisu - zwiększone */}
        <div className={`relative ${errors.description ? 'mb-1' : 'mb-0'}`}>
          <textarea
            name="description"
            rows="20"
            maxLength={maxDescriptionLength}
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Wpisz opis pojazdu..."
            className={`
              w-full border rounded-[2px] p-6 text-gray-700 text-base
              focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]
              ${errors.description ? 'border-red-500' : 'border-gray-300'}
            `}
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word', minHeight: '400px', fontSize: '16px', lineHeight: '1.6' }}
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
      <div className="mb-10">
        <h3 className="text-white p-2 rounded-[2px] mb-4 bg-[#35530A]">
          Cena i opcje zakupu
        </h3>
        
        {/* Opcje zakupu jako karty wyboru z radio buttonami */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-3">
            Opcja zakupu*
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {purchaseOptions.map(option => (
              <div 
                key={option.value}
                className={`
                  border p-4 rounded-[2px] cursor-pointer transition-all hover:shadow-md
                  ${formData.purchaseOptions === option.value 
                    ? 'border-[#35530A] bg-[#F5FAF5]' 
                    : 'border-gray-300'
                  }
                `}
                onClick={() => handlePurchaseOptionChange(option.value)}
              >
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    checked={formData.purchaseOptions === option.value}
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
        
        {/* Cena - kompaktowy układ */}
        <div className="flex flex-col items-center gap-4 mb-6">
          {/* Pole ceny standardowej - wyśrodkowane */}
          <div className="w-full max-w-md">
            <FormField
              type="number"
              label="Cena (zł)*"
              name="price"
              value={formData.price}
              onChange={(e) => handleNumberChange('price', e.target.value)}
              error={errors.price}
              min="0"
              placeholder="np. 25000"
            />
          </div>
          
          {/* Dodatkowe pole dla najmu - wyświetlane tylko gdy wybrano opcję najmu */}
          {hasRentalOption && (
            <div className="w-full max-w-md">
              <FormField
                type="number"
                label="Cena najmu (zł/miesiąc)*"
                name="rentalPrice"
                value={formData.rentalPrice}
                onChange={(e) => handleNumberChange('rentalPrice', e.target.value)}
                error={errors.rentalPrice}
                min="0"
                placeholder="np. 1500"
              />
            </div>
          )}
          
          {/* Możliwość negocjacji - mniejszy przycisk obok */}
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer bg-gray-50 px-3 py-2 rounded-md border hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.negotiable === 'Tak'}
                onChange={(e) => handleChange('negotiable', e.target.checked ? 'Tak' : 'Nie')}
                className="mr-2 accent-[#35530A]"
              />
              <span className="text-sm">Cena do negocjacji</span>
            </label>
          </div>
        </div>
        
      </div>
      
        </div>
      </div>
    </div>
  );
};

export default DescriptionPriceSection;
