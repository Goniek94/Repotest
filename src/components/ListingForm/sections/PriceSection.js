import React, { useState } from 'react';
import FormField from '../components/FormField';
import { DollarSign } from 'lucide-react';

const PriceSection = ({ formData, handleChange, errors }) => {
  const [showCustomPurchaseModal, setShowCustomPurchaseModal] = useState(false);
  const [customPurchaseOption, setCustomPurchaseOption] = useState('');
  // Funkcja do generowania dynamicznego opisu dla opcji "Inne"
  const getInneDescription = () => {
    const customOptions = ['Cesja', 'Zamiana', 'Najem'];
    const selectedOption = formData.purchaseOptions;
    
    if (customOptions.includes(selectedOption)) {
      return `Inna forma zakupu (wybrano: ${selectedOption})`;
    }
    
    return 'Inna forma zakupu (np. cesja, zamiana, najem)';
  };

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
      description: getInneDescription()
    }
  ];
  
  // Walidacja wartości liczbowych - zapobiega wprowadzaniu wartości ujemnych
  const handleNumberChange = (field, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue >= 0) {
      handleChange(field, value);
    }
  };
  
  // Funkcje obsługi modala dla niestandardowych opcji zakupu
  const handleCustomPurchaseSubmit = () => {
    if (customPurchaseOption.trim()) {
      handleChange('purchaseOptions', customPurchaseOption.trim());
      handleChange('purchaseOption', customPurchaseOption.toLowerCase() === 'najem' ? 'najem' : 'sprzedaz');
      setShowCustomPurchaseModal(false);
      setCustomPurchaseOption('');
    }
  };

  const handleCustomPurchaseCancel = () => {
    setShowCustomPurchaseModal(false);
    setCustomPurchaseOption('');
  };

  // Obsługa zmiany opcji zakupu (radio button)
  const handlePurchaseOptionChange = (option) => {
    if (option === 'inne') {
      setShowCustomPurchaseModal(true);
    } else {
      // Aktualizacja stanu - pojedyncza wartość zamiast tablicy
      handleChange('purchaseOptions', option);
      
      // Jeśli wybrano opcję "inne", dodajemy też pole purchaseOption dla kompatybilności
      handleChange('purchaseOption', option === 'inne' ? 'najem' : 'sprzedaz');
    }
  };
  
  // Sprawdzamy czy wybrano opcję najmu (dla wyświetlenia odpowiedniego pola ceny)
  const hasRentalOption = formData.purchaseOption === 'najem' || formData.purchaseOptions === 'Najem';
  
  // Sprawdzamy czy wybrano cesję (dla wyświetlenia dodatkowych pól)
  const hasCessionOption = formData.purchaseOptions === 'Cesja';
  
  // Sprawdzamy czy wybrano zamianę (dla wyświetlenia dodatkowych pól)
  const hasExchangeOption = formData.purchaseOptions === 'Zamiana';

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white">
      {/* Jedna główna karta - kompaktowa */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header karty */}
        <div className="bg-gradient-to-r from-[#35530A] to-[#2D4A06] text-white p-4">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 mr-3" />
            <div>
              <h2 className="text-xl font-bold">Cena i opcje zakupu</h2>
              <p className="text-green-100 text-sm">Warunki sprzedaży pojazdu</p>
            </div>
          </div>
        </div>

        {/* Zawartość karty */}
        <div className="p-6 space-y-6">
          {/* Opcje zakupu jako karty wyboru z radio buttonami */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-3">
              Opcja zakupu*
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {purchaseOptions.map(option => {
                // Sprawdzamy czy opcja jest wybrana - dla "inne" sprawdzamy też niestandardowe opcje
                const isSelected = option.value === 'inne' 
                  ? ['Cesja', 'Zamiana', 'Najem'].includes(formData.purchaseOptions) || formData.purchaseOptions === 'inne'
                  : formData.purchaseOptions === option.value;

                return (
                  <div 
                    key={option.value}
                    className={`
                      border p-4 rounded-[2px] cursor-pointer transition-all hover:shadow-md
                      ${isSelected 
                        ? 'border-[#35530A] bg-[#F5FAF5]' 
                        : 'border-gray-300'
                      }
                    `}
                    onClick={() => handlePurchaseOptionChange(option.value)}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => handlePurchaseOptionChange(option.value)}
                        className="mr-2 accent-[#35530A]"
                      />
                      <span className="font-semibold">{option.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                );
              })}
            </div>
            {errors.purchaseOptions && (
              <p className="text-red-500 text-sm mt-1">{errors.purchaseOptions}</p>
            )}
          </div>
          
          {/* Cena - kompaktowy układ */}
          <div className="flex flex-col items-center gap-4 mb-6">
            {/* Pole ceny standardowej - wyśrodkowane - ukryte dla cesji */}
            {!hasCessionOption && (
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
            )}
            
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

          {/* Dodatkowe pola dla cesji */}
          {hasCessionOption && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-[#35530A] mb-3">Informacje o cesji</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  type="text"
                  label="Firma leasingowa/bank*"
                  name="leasingCompany"
                  value={formData.leasingCompany || ''}
                  onChange={(e) => handleChange('leasingCompany', e.target.value)}
                  error={errors.leasingCompany}
                  placeholder="np. PKO Leasing, Santander Consumer Bank"
                />
                <FormField
                  type="number"
                  label="Pozostałe raty (ilość)*"
                  name="remainingInstallments"
                  value={formData.remainingInstallments || ''}
                  onChange={(e) => handleChange('remainingInstallments', e.target.value)}
                  error={errors.remainingInstallments}
                  placeholder="np. 24"
                  min="1"
                />
                <FormField
                  type="number"
                  label="Wysokość raty (zł/miesiąc)*"
                  name="installmentAmount"
                  value={formData.installmentAmount || ''}
                  onChange={(e) => handleNumberChange('installmentAmount', e.target.value)}
                  error={errors.installmentAmount}
                  placeholder="np. 1200"
                  min="0"
                />
                <FormField
                  type="number"
                  label="Opłata za cesję (zł)"
                  name="cessionFee"
                  value={formData.cessionFee || ''}
                  onChange={(e) => handleNumberChange('cessionFee', e.target.value)}
                  error={errors.cessionFee}
                  placeholder="np. 500"
                  min="0"
                />
              </div>
            </div>
          )}

          {/* Dodatkowe pola dla zamiany */}
          {hasExchangeOption && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-[#35530A] mb-3">Informacje o zamianie</h3>
              <FormField
                type="textarea"
                label="Co oferujesz w zamian*"
                name="exchangeOffer"
                value={formData.exchangeOffer || ''}
                onChange={(e) => handleChange('exchangeOffer', e.target.value)}
                error={errors.exchangeOffer}
                placeholder="np. BMW X3 2018, 150 000 km + dopłata 20 000 zł"
                rows="3"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  type="number"
                  label="Szacowana wartość oferowanego pojazdu (zł)"
                  name="exchangeValue"
                  value={formData.exchangeValue || ''}
                  onChange={(e) => handleNumberChange('exchangeValue', e.target.value)}
                  placeholder="np. 80000"
                  min="0"
                />
                <FormField
                  type="number"
                  label="Dopłata (zł)"
                  name="exchangePayment"
                  value={formData.exchangePayment || ''}
                  onChange={(e) => handleNumberChange('exchangePayment', e.target.value)}
                  placeholder="np. 20000 (może być ujemna)"
                />
              </div>
              <FormField
                type="textarea"
                label="Dodatkowe warunki zamiany"
                name="exchangeConditions"
                value={formData.exchangeConditions || ''}
                onChange={(e) => handleChange('exchangeConditions', e.target.value)}
                placeholder="np. pojazd musi być bezwypadkowy, serwisowany w ASO..."
                rows="2"
              />
            </div>
          )}

        </div>
      </div>

      {/* Modal dla niestandardowych opcji zakupu */}
      {showCustomPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Wybierz opcję zakupu
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Wybierz konkretną opcję, która będzie wyświetlana w ogłoszeniu:
            </p>
            <div className="space-y-4 mb-4">
              {[
                { 
                  value: 'Cesja', 
                  label: 'Cesja', 
                  description: 'Przeniesienie praw i obowiązków z umowy leasingu/kredytu na kupującego' 
                },
                { 
                  value: 'Zamiana', 
                  label: 'Zamiana', 
                  description: 'Wymiana pojazdu na inny pojazd lub przedmiot o podobnej wartości' 
                },
                { 
                  value: 'Najem', 
                  label: 'Najem', 
                  description: 'Wynajem pojazdu na określony czas za miesięczną opłatą' 
                }
              ].map((option) => (
                <label key={option.value} className="flex flex-col cursor-pointer p-3 border rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      name="customPurchaseOption"
                      value={option.value}
                      checked={customPurchaseOption === option.value}
                      onChange={(e) => setCustomPurchaseOption(e.target.value)}
                      className="mr-3 accent-[#35530A]"
                    />
                    <span className="text-gray-800 font-medium">{option.label}</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">{option.description}</p>
                </label>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCustomPurchaseCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={handleCustomPurchaseSubmit}
                disabled={!customPurchaseOption}
                className="px-4 py-2 bg-[#35530A] text-white rounded-md hover:bg-[#2a4208] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Zatwierdź
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceSection;
