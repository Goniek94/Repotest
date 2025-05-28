import React from 'react';

const VehicleStatusSection = ({ formData, handleChange, errors }) => {
  // Lista opcji stanu pojazdu z możliwością wyboru wielu
  const statusOptions = [
    { name: 'condition', label: 'Stan', options: ['Nowy', 'Używany'], required: true, type: 'radio' },
    { name: 'accidentStatus', label: 'Wypadkowość', options: ['Bezwypadkowy', 'Powypadkowy'], type: 'radio' },
    { name: 'damageStatus', label: 'Uszkodzenia', options: ['Nieuszkodzony', 'Uszkodzony'], type: 'radio' },
    { name: 'tuning', label: 'Tuning' },
    { name: 'imported', label: 'Importowany' },
    { name: 'registeredInPL', label: 'Zarejestrowany w PL' },
    { name: 'firstOwner', label: 'Pierwszy właściciel' },
    { name: 'disabledAdapted', label: 'Dla niepełnosprawnych' }
  ];

  // Obsługa zmiany stanu pola
  const handleOptionChange = (name, option, type = 'checkbox') => {
    // Dla przycisków radio zawsze ustawiamy wartość
    if (type === 'radio') {
      handleChange(name, option);
    } else {
      // Dla checkboxów przełączamy między Tak/Nie
      const newValue = formData[name] === 'Tak' ? 'Nie' : 'Tak';
      handleChange(name, newValue);
    }
  };

  // Sprawdzanie, czy opcja jest zaznaczona
  const isSelected = (name, option = 'Tak', type = 'checkbox') => {
    if (type === 'radio') {
      return formData[name] === option;
    }
    return formData[name] === option;
  };

  return (
    <div className="bg-white p-6 rounded-[2px] shadow-md">
      {/* Nagłówek przeniesiony do nadrzędnego komponentu CreateListingForm */}
      
      <div className="mb-6">
        {/* Grid z opcjami stanu pojazdu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statusOptions.slice(0, 4).map((option) => (
            <div 
              key={option.name} 
              className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                (option.type === 'radio' && formData[option.name]) || 
                (!option.type && formData[option.name] === 'Tak') 
                  ? 'border-[#35530A] bg-green-50' 
                  : 'border-gray-300'
              }`}
            >
              <label className="block font-semibold mb-3 text-gray-800">
                {option.label}
                {option.required && <span className="text-red-500 ml-1">*</span>}
                {errors[option.name] && <span className="text-red-500 ml-1 text-sm">({errors[option.name]})</span>}
              </label>
              
              <div className="space-y-2">
                {option.options ? (
                  // Opcje wyboru dla pól z wieloma wartościami
                  option.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type={option.type || 'radio'}
                        name={option.name}
                        checked={isSelected(option.name, opt, option.type)}
                        onChange={() => handleOptionChange(option.name, opt, option.type)}
                        className="w-4 h-4"
                        style={{ accentColor: '#35530A' }}
                      />
                      <span className="text-sm group-hover:text-[#35530A] transition-colors">
                        {opt}
                      </span>
                    </label>
                  ))
                ) : (
                  // Checkbox Tak/Nie dla prostych pól
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isSelected(option.name)}
                      onChange={() => handleOptionChange(option.name)}
                      className="w-4 h-4"
                      style={{ accentColor: '#35530A' }}
                    />
                    <span className="text-sm group-hover:text-[#35530A] transition-colors">
                      Tak
                    </span>
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Drugi rząd opcji */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusOptions.slice(4).map((option) => (
            <div 
              key={option.name} 
              className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                (option.type === 'radio' && formData[option.name]) || 
                (!option.type && formData[option.name] === 'Tak') 
                  ? 'border-[#35530A] bg-green-50' 
                  : 'border-gray-300'
              }`}
            >
              <label className="block font-semibold mb-3 text-gray-800">
                {option.label}
                {option.required && <span className="text-red-500 ml-1">*</span>}
                {errors[option.name] && <span className="text-red-500 ml-1 text-sm">({errors[option.name]})</span>}
              </label>
              
              <div className="space-y-2">
                {option.options ? (
                  // Opcje wyboru dla pól z wieloma wartościami
                  option.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type={option.type || 'radio'}
                        name={option.name}
                        checked={isSelected(option.name, opt, option.type)}
                        onChange={() => handleOptionChange(option.name, opt, option.type)}
                        className="w-4 h-4"
                        style={{ accentColor: '#35530A' }}
                      />
                      <span className="text-sm group-hover:text-[#35530A] transition-colors">
                        {opt}
                      </span>
                    </label>
                  ))
                ) : (
                  // Checkbox Tak/Nie dla prostych pól
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isSelected(option.name)}
                      onChange={() => handleOptionChange(option.name)}
                      className="w-4 h-4"
                      style={{ accentColor: '#35530A' }}
                    />
                    <span className="text-sm group-hover:text-[#35530A] transition-colors">
                      Tak
                    </span>
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Informacja pomocnicza */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-[2px]">
        <p className="text-[#35530A] text-sm">
          Dokładne informacje o stanie pojazdu zwiększają zaufanie do Twojego ogłoszenia. 
          Zaznacz wszystkie opcje, które opisują Twój pojazd.
        </p>
      </div>
    </div>
  );
};

export default VehicleStatusSection;