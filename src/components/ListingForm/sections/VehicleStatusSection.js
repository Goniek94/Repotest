import React from 'react';
import { useListingForm } from '../../../contexts/ListingFormContext';
import FormField from '../components/FormField';

const VehicleStatusSection = ({ formData, handleChange, errors }) => {
  // Grupa przycisków radio dla opcji tak/nie
  const RadioGroup = ({ name, label, value, onChange, error }) => (
    <div>
      <label className="block font-semibold mb-1">
        {label}
        {error && <span className="text-red-500 ml-1 text-sm">({error})</span>}
      </label>
      <div className="flex gap-4">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={name}
            value="Tak"
            checked={value === 'Tak'}
            onChange={(e) => onChange(name, e.target.value)}
            style={{ accentColor: '#35530A' }}
          />
          <span>Tak</span>
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={name}
            value="Nie"
            checked={value === 'Nie'}
            onChange={(e) => onChange(name, e.target.value)}
            style={{ accentColor: '#35530A' }}
          />
          <span>Nie</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-[2px] shadow-md">
      <h2 className="text-2xl font-bold mb-6">Stan pojazdu</h2>
      
      <div className="mb-6">
        <h3 className="text-white p-2 rounded-[2px] mb-4 bg-[#35530A]">
          Stan pojazdu:
        </h3>
        
        {/* Stan, wypadkowość, uszkodzenia, tuning */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Stan */}
          <div>
            <label className="block font-semibold mb-1">
              Stan:*
              {errors.condition && <span className="text-red-500 ml-1 text-sm">({errors.condition})</span>}
            </label>
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
                  onChange={(e) => handleChange('accidentStatus', e.target.value)}
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
                  onChange={(e) => handleChange('accidentStatus', e.target.value)}
                  style={{ accentColor: '#35530A' }}
                />
                <span>Powypadkowy</span>
              </label>
            </div>
          </div>
          
          {/* Uszkodzenia */}
          <div>
            <label className="block font-semibold mb-1">Uszkodzenia:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="damageStatus"
                  value="Nieuszkodzony"
                  checked={formData.damageStatus === 'Nieuszkodzony'}
                  onChange={(e) => handleChange('damageStatus', e.target.value)}
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
                  onChange={(e) => handleChange('damageStatus', e.target.value)}
                  style={{ accentColor: '#35530A' }}
                />
                <span>Uszkodzony</span>
              </label>
            </div>
          </div>
          
          {/* Tuning */}
          <RadioGroup
            name="tuning"
            label="Tuning:"
            value={formData.tuning}
            onChange={handleChange}
          />
        </div>
        
        {/* Importowany, zarejestrowany w PL, pierwszy właściciel, dla niepełnosprawnych */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <RadioGroup
            name="imported"
            label="Importowany:"
            value={formData.imported}
            onChange={handleChange}
          />
          
          <RadioGroup
            name="registeredInPL"
            label="Zarejestrowany w PL:"
            value={formData.registeredInPL}
            onChange={handleChange}
          />
          
          <RadioGroup
            name="firstOwner"
            label="Pierwszy właściciel:"
            value={formData.firstOwner}
            onChange={handleChange}
          />
          
          <RadioGroup
            name="disabledAdapted"
            label="Dla niepełnosprawnych:"
            value={formData.disabledAdapted}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleStatusSection;