import React from 'react';

const TechnicalDetails = ({ listing }) => {
  // Komponent pomocniczy do wyświetlania wiersza danych
  const InfoRow = ({ label, value }) => (
    <div className="p-2 bg-gray-50 rounded-sm">
      <div className="text-gray-600 font-medium">{label}</div>
      <div className="font-semibold text-black">{value || 'Nie podano'}</div>
    </div>
  );

  // Przygotowanie danych do wyświetlenia w tabeli
  // Ujednolicone nazwy pól zgodnie z formularzem
  const details = {
    'Marka': listing.make || listing.brand,
    'Model': listing.model,
    'Generacja': listing.generation,
    'Wersja': listing.version,
    'Rok produkcji': listing.year?.toString() || listing.productionYear?.toString(),
    'Przebieg': listing.mileage ? `${listing.mileage.toLocaleString()} km` : null,
    'Ostatni przebieg (CEPiK)': listing.lastOfficialMileage ? `${listing.lastOfficialMileage.toLocaleString()} km` : null,
    'Stan': listing.condition,
    'Wypadkowość': listing.accidentStatus,
    'Uszkodzenia': listing.damageStatus,
    'Pierwszy właściciel': listing.firstOwner,
    'Zarejestrowany w PL': listing.registeredInPL,
    'Importowany': listing.imported,
    'Tuning': listing.tuning,
    'Dla niepełnosprawnych': listing.disabledAdapted,
    'Rodzaj paliwa': listing.fuelType || listing.fuel,
    'Pojemność silnika': listing.engineSize ? `${listing.engineSize} cm³` : null,
    'Moc': listing.power ? `${listing.power} KM` : null,
    'Skrzynia biegów': listing.transmission,
    'Napęd': listing.drive,
    'Typ nadwozia': listing.bodyType,
    'Kolor': listing.color,
    'Liczba drzwi': listing.doors?.toString(),
    'Liczba miejsc': listing.seats?.toString(),
    'Waga': listing.weight ? `${listing.weight} kg` : null,
    'Kraj pochodzenia': listing.countryOfOrigin,
    'VIN': listing.vin,
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-sm">
      <h2 className="text-lg font-bold mb-4 text-black">
        Dane techniczne
      </h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {Object.entries(details).map(([key, value]) => (
          value ? <InfoRow key={key} label={key} value={value} /> : null
        ))}
      </div>
    </div>
  );
};

export default TechnicalDetails;