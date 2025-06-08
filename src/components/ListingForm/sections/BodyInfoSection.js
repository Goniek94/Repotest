import React from 'react';
import FormField from '../components/FormField';
import { BODY_TYPES, COLORS } from '../../../constants/vehicleOptions';

const BodyInfoSection = ({ formData, handleChange, errors }) => {
  
  // Opcje dla liczby drzwi
  const doorOptions = [
    { value: '2', label: '2 drzwi' },
    { value: '3', label: '3 drzwi' },
    { value: '4', label: '4 drzwi' },
    { value: '5', label: '5 drzwi' },
    { value: '6', label: '6 drzwi' }
  ];
  
  // Opcje dla wykończenia
  const finishOptions = [
    { value: 'Metalik', label: 'Metalik' },
    { value: 'Matowy', label: 'Matowy' },
    { value: 'Perłowy', label: 'Perłowy' },
    { value: 'Standardowy', label: 'Standardowy' }
  ];
  
  return (
    <div className="bg-white p-6 rounded-[2px] shadow-md">
      {/* Nagłówek główny przeniesiony do komponentu CreateListingForm */}
      <div className="mb-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Typ nadwozia jako dropdown zamiast radio buttons */}
          <FormField
            type="select"
            label="Typ nadwozia*"
            name="bodyType"
            value={formData.bodyType}
            onChange={(e) => handleChange('bodyType', e.target.value)}
            error={errors.bodyType}
            options={BODY_TYPES.map(type => ({ value: type, label: type }))}
            placeholder="Wybierz typ nadwozia"
          />
          
          {/* Kolor */}
          <FormField
            type="select"
            label="Kolor*"
            name="color"
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
            error={errors.color}
            options={COLORS.map(color => ({ value: color, label: color }))}
            placeholder="Wybierz kolor"
          />
          
          {/* Liczba drzwi jako dropdown */}
          <FormField
            type="select"
            label="Liczba drzwi*"
            name="doors"
            value={formData.doors}
            onChange={(e) => handleChange('doors', e.target.value)}
            error={errors.doors}
            options={doorOptions}
            placeholder="Wybierz ilość drzwi"
          />
          
          {/* Rodzaj wykończenia */}
          <FormField
            type="select"
            label="Wykończenie"
            name="finish"
            value={formData.finish || ''}
            onChange={(e) => handleChange('finish', e.target.value)}
            error={errors.finish}
            options={finishOptions}
            placeholder="Wybierz wykończenie"
          />
        </div>
        
        {/* Dodatkowe cechy nadwozia jako checkboxy */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Dodatkowe cechy nadwozia:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasSunroof === 'Tak'}
                onChange={(e) => handleChange('hasSunroof', e.target.checked ? 'Tak' : 'Nie')}
                style={{ accentColor: '#35530A' }}
              />
              <span>Szyberdach</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasAlloyWheels === 'Tak'}
                onChange={(e) => handleChange('hasAlloyWheels', e.target.checked ? 'Tak' : 'Nie')}
                style={{ accentColor: '#35530A' }}
              />
              <span>Alufelgi</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasRoofRails === 'Tak'}
                onChange={(e) => handleChange('hasRoofRails', e.target.checked ? 'Tak' : 'Nie')}
                style={{ accentColor: '#35530A' }}
              />
              <span>Relingi dachowe</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasParkingSensors === 'Tak'}
                onChange={(e) => handleChange('hasParkingSensors', e.target.checked ? 'Tak' : 'Nie')}
                style={{ accentColor: '#35530A' }}
              />
              <span>Czujniki parkowania</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Informacje pomocnicze */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-[2px] mt-4">
        <p className="text-[#35530A] text-sm font-medium">
          Dokładne dane dotyczące nadwozia i koloru pomagają potencjalnym kupującym 
          lepiej ocenić pojazd. Wybierz wszystkie parametry, które najlepiej opisują Twój samochód.
        </p>
      </div>
    </div>
  );
};

export default BodyInfoSection;
