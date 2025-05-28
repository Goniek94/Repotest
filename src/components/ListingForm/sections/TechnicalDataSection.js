import React from 'react';
import FormField from '../components/FormField';

const TechnicalDataSection = ({ formData, handleChange, errors }) => {
  // Opcje dla typów
  const fuelTypes = ['Benzyna', 'Diesel', 'Benzyna+LPG', 'Elektryczny', 'Hybryda'];
  const transmissionTypes = ['Manualna', 'Automatyczna', 'Półautomatyczna'];
  const driveTypes = ['Przedni', 'Tylny', '4x4'];
  const countries = ['Polska', 'Niemcy', 'Francja', 'Włochy', 'Holandia', 'Belgia', 'Austria', 'Czechy', 'Słowacja', 'Szwajcaria', 'USA', 'Inny'];

  return (
    <div className="bg-white p-6 rounded-[2px] shadow-md">
      {/* Nagłówek główny przeniesiony do komponentu CreateListingForm */}
      
      {/* Przebieg i podstawowe parametry */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Przebieg */}
        <FormField
          type="number"
          label="Przebieg (km)*"
          name="mileage"
          value={formData.mileage}
          onChange={(e) => handleChange('mileage', e.target.value)}
          error={errors.mileage}
          min="0"
          max="1000000"
          placeholder="np. 75000"
          info="Przebieg musi być liczbą nieujemną"
        />
        
        {/* Ostatni przebieg CEPiK */}
        <FormField
          type="number"
          label="Ostatni przebieg (CEPiK)"
          name="lastOfficialMileage"
          value={formData.lastOfficialMileage}
          onChange={(e) => handleChange('lastOfficialMileage', e.target.value)}
          error={errors.lastOfficialMileage}
          min="0"
          max="1000000"
          placeholder="np. 70000"
          info="Z ostatniego badania technicznego"
        />
        
        {/* Rodzaj paliwa */}
        <FormField
          type="select"
          label="Rodzaj paliwa*"
          name="fuelType"
          value={formData.fuelType}
          onChange={(e) => handleChange('fuelType', e.target.value)}
          error={errors.fuelType}
          options={fuelTypes.map(type => ({ value: type, label: type }))}
          placeholder="Wybierz rodzaj paliwa"
        />
        
        {/* Kraj pochodzenia */}
        <FormField
          type="select"
          label="Kraj pochodzenia"
          name="countryOfOrigin"
          value={formData.countryOfOrigin}
          onChange={(e) => handleChange('countryOfOrigin', e.target.value)}
          options={countries.map(country => ({ value: country, label: country }))}
          placeholder="Wybierz kraj"
        />
      </div>
      
      {/* Parametry silnika */}
      <div className="mb-6">
        <h3 className="text-white p-2 rounded-[2px] mb-4 bg-[#35530A]">
          Parametry silnika i układu napędowego
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Moc silnika */}
          <FormField
            type="number"
            label="Moc (KM)*"
            name="power"
            value={formData.power}
            onChange={(e) => handleChange('power', e.target.value)}
            error={errors.power}
            min="1"
            max="2000"
            placeholder="np. 150"
            info="Podaj w koniach mechanicznych (KM)"
          />
          
          {/* Pojemność silnika */}
          <FormField
            type="number"
            label="Pojemność silnika (cm³)"
            name="engineSize"
            value={formData.engineSize}
            onChange={(e) => handleChange('engineSize', e.target.value)}
            error={errors.engineSize}
            min="1"
            max="10000"
            placeholder="np. 1998"
            info="Podaj pojemność w cm³"
          />
          
          {/* Skrzynia biegów */}
          <FormField
            type="select"
            label="Skrzynia biegów*"
            name="transmission"
            value={formData.transmission}
            onChange={(e) => handleChange('transmission', e.target.value)}
            error={errors.transmission}
            options={transmissionTypes.map(type => ({ value: type, label: type }))}
            placeholder="Wybierz typ skrzyni"
          />
          
          {/* Napęd */}
          <FormField
            type="select"
            label="Napęd*"
            name="drive"
            value={formData.drive}
            onChange={(e) => handleChange('drive', e.target.value)}
            error={errors.drive}
            options={driveTypes.map(type => ({ value: type, label: type }))}
            placeholder="Wybierz napęd"
          />
          
          {/* Waga */}
          <FormField
            type="number"
            label="Waga (kg)"
            name="weight"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            error={errors.weight}
            min="1"
            max="10000"
            placeholder="np. 1500"
          />
        </div>
      </div>
        
      {/* Informacje pomocnicze */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-[2px] mt-4">
        <p className="text-[#35530A] text-sm font-medium">
          Dokładne dane techniczne pozwolą kupującym lepiej ocenić wartość Twojego pojazdu
          i zdecydować, czy spełnia on ich wymagania. Podaj jak najwięcej szczegółów.
        </p>
      </div>
    </div>
  );
  };
  
  export default TechnicalDataSection;
