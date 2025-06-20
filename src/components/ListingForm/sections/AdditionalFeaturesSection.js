import React, { useState } from 'react';

// Lista popularnych wyposażeń dodatkowych
const POPULAR_FEATURES = [
  'Klimatyzacja',
  'Podgrzewane fotele',
  'Nawigacja GPS',
  'Kamera cofania',
  'Czujniki parkowania',
  'Bluetooth',
  'System audio premium',
  'Skórzana tapicerka',
  'Szyberdach',
  'Alufelgi',
  'Tempomat',
  'Elektryczne szyby',
  'Elektryczne lusterka',
  'Poduszki powietrzne',
  'System bezkluczykowy',
  'Asystent pasa ruchu',
  'Asystent martwego pola',
  'Automatyczne światła',
  'Automatyczne wycieraczki',
  'Hak holowniczy'
];

const AdditionalFeaturesSection = ({ formData, setFormData, errors }) => {
  // Stan dla śledzenia otwartych/zamkniętych list rozwijanych
  const [openDropdowns, setOpenDropdowns] = useState({});
  
  // Stan dla niestandardowego wyposażenia
  const [customFeature, setCustomFeature] = useState('');

  // Inicjalizacja formData.additionalFeatures jeśli nie istnieje
  if (!formData.additionalFeatures) {
    setFormData({
      ...formData,
      additionalFeatures: []
    });
  }


  // Obsługa otwierania/zamykania listy rozwijanej
  const toggleDropdown = (name) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Obsługa zmiany opcji
  const handleOptionChange = (name, option) => {
    if (name.startsWith('deliveryOptions.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        deliveryOptions: {
          ...formData.deliveryOptions,
          [field]: option
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: option
      });
    }
    
    // Zamknij dropdown po wyborze opcji
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: false
    }));
  };

  // Obsługa zmiany pól numerycznych
  const handleNumberChange = (name, value) => {
    if (name.startsWith('deliveryOptions.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        deliveryOptions: {
          ...formData.deliveryOptions,
          [field]: value === '' ? null : Number(value)
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value === '' ? null : Number(value)
      });
    }
  };

  // Obsługa dodawania/usuwania wyposażenia
  const toggleFeature = (feature) => {
    const features = formData.additionalFeatures || [];
    
    if (features.includes(feature)) {
      // Usuń cechę
      setFormData({
        ...formData,
        additionalFeatures: features.filter(f => f !== feature)
      });
    } else {
      // Dodaj cechę
      setFormData({
        ...formData,
        additionalFeatures: [...features, feature]
      });
    }
  };

  // Obsługa dodawania niestandardowego wyposażenia
  const addCustomFeature = () => {
    if (customFeature.trim() === '') return;
    
    const features = formData.additionalFeatures || [];
    
    if (!features.includes(customFeature)) {
      setFormData({
        ...formData,
        additionalFeatures: [...features, customFeature]
      });
      setCustomFeature('');
    }
  };

  // Komponent pola select (lista rozwijana)
  const SelectField = ({ name, label, options, required }) => {
    const isDeliveryOption = name.startsWith('deliveryOptions.');
    const fieldName = isDeliveryOption ? name.split('.')[1] : name;
    const currentValue = isDeliveryOption 
      ? (formData.deliveryOptions && formData.deliveryOptions[fieldName]) 
      : formData[name];
    
    return (
      <div className="relative">
        <label className="block font-semibold mb-3 text-gray-800">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {errors[name] && <span className="text-red-500 ml-1 text-sm">({errors[name]})</span>}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown(name)}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] bg-white text-left flex items-center justify-between"
          >
            <span className={`${currentValue ? 'text-gray-700' : 'text-gray-500'}`}>
              {currentValue || 'Wybierz'}
            </span>
            <span className={`transform transition-transform ${openDropdowns[name] ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {openDropdowns[name] && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg overflow-y-auto">
              {options.map((option) => (
                <div 
                  key={option} 
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleOptionChange(name, option)}
                >
                  <span className={`text-sm ${currentValue === option ? 'font-semibold text-[#35530A]' : ''}`}>
                    {option}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Wyposażenie dodatkowe */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Wyposażenie dodatkowe</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {POPULAR_FEATURES.map(feature => (
            <div 
              key={feature}
              onClick={() => toggleFeature(feature)}
              className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                formData.additionalFeatures && formData.additionalFeatures.includes(feature) 
                  ? 'border-[#35530A] bg-green-50' 
                  : 'border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 flex-shrink-0 border rounded mr-2 ${
                  formData.additionalFeatures && formData.additionalFeatures.includes(feature)
                    ? 'bg-[#35530A] border-[#35530A] flex items-center justify-center'
                    : 'border-gray-400'
                }`}>
                  {formData.additionalFeatures && formData.additionalFeatures.includes(feature) && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Dodawanie niestandardowego wyposażenia */}
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={customFeature}
            onChange={(e) => setCustomFeature(e.target.value)}
            placeholder="Dodaj własne wyposażenie"
            className="flex-grow h-10 text-sm px-3 border border-gray-300 rounded-l-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          />
          <button
            type="button"
            onClick={addCustomFeature}
            className="h-10 px-4 bg-[#35530A] text-white rounded-r-[2px] hover:bg-[#2D4A06] transition-colors"
          >
            Dodaj
          </button>
        </div>
        
        {/* Lista wybranego wyposażenia */}
        {formData.additionalFeatures && formData.additionalFeatures.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Wybrane wyposażenie:</h4>
            <div className="flex flex-wrap gap-2">
              {formData.additionalFeatures.map(feature => (
                <div 
                  key={feature}
                  className="bg-green-50 border border-[#35530A] rounded-full px-3 py-1 text-sm flex items-center"
                >
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      
      {/* Informacja pomocnicza */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-[2px]">
        <p className="text-[#35530A] text-sm">
          Dodatkowe informacje o wyposażeniu i opcjach dostawy zwiększają atrakcyjność Twojego ogłoszenia.
          Wszystkie te informacje będą widoczne dla potencjalnych kupujących.
        </p>
      </div>
    </div>
  );
};

export default AdditionalFeaturesSection;
