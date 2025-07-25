import React from 'react';

const TechnicalDetails = ({ listing }) => {
  // Komponent pomocniczy do wyświetlania wiersza danych
  const InfoRow = ({ label, value }) => (
    <div className="p-2 bg-gray-50 rounded-sm">
      <div className="text-gray-600 font-medium">{label}</div>
      <div className="font-semibold text-black">{value || 'Nie podano'}</div>
    </div>
  );

  // Dane techniczne - połączone z danymi nadwozia
  const technicalData = [
    { label: "Marka", value: listing.make || listing.brand },
    { label: "Model", value: listing.model },
    { label: "Generacja", value: listing.generation },
    { label: "Wersja silnika", value: listing.version },
    { label: "Rok produkcji", value: listing.year?.toString() || listing.productionYear?.toString() },
    { label: "Przebieg", value: listing.mileage ? `${listing.mileage.toLocaleString()} km` : null },
    { label: "Paliwo", value: listing.fuelType || listing.fuel },
    { label: "Moc", value: listing.power ? `${listing.power} KM` : null },
    { label: "Pojemność", value: listing.engineSize ? `${listing.engineSize} cm³` : null },
    { label: "Skrzynia", value: listing.transmission },
    { label: "Napęd", value: listing.drive },
    { label: "Waga", value: listing.weight ? `${listing.weight} kg` : null },
    { label: "Typ nadwozia", value: listing.bodyType },
    { label: "Kolor", value: listing.color },
    { label: "Liczba drzwi", value: listing.doors?.toString() },
    { label: "Liczba miejsc", value: listing.seats?.toString() },
    { label: "Wykończenie", value: listing.paintFinish || listing.finish },
    { label: "Tuning", value: listing.tuning },
  ];

  // Stan pojazdu - zmieniona nazwa z "Stan techniczny"
  const vehicleStatusData = [
    { label: "Stan techniczny", value: listing.condition },
    { label: "Pierwszy właściciel", value: listing.firstOwner },
    { label: "Importowany", value: listing.imported },
    { label: "Zarejestrowany w PL", value: listing.registeredInPL },
    { label: "Typ sprzedawcy", value: listing.sellerType },
    { label: "Wypadkowość", value: listing.accidentStatus },
    { label: "Uszkodzenia", value: listing.damageStatus },
    { label: "Adaptacja medyczna", value: listing.disabledAdapted },
    { label: "VIN", value: listing.vin },
    { label: "Nr rejestracyjny", value: listing.registrationNumber },
    { label: "Data pierwszej rejestracji", value: listing.firstRegistrationDate },
  ];

  // Informacje dodatkowe
  const additionalInfo = [
    { label: "Cena do negocjacji", value: listing.negotiable },
    { label: "Opcja zakupu", value: listing.purchaseOptions },
  ];

  // Pobierz dane potrzebne do nagłówka
  const brand = listing.make || listing.brand || '';
  const model = listing.model || '';
  const vehicleTitle = `${brand} ${model}`.trim();
  const price = listing.price ? `${listing.price.toLocaleString()} zł` : "Cena na żądanie";

  return (
    <div className="bg-white p-6 shadow-md rounded-sm">
      <div className="mb-8 text-center border-b pb-6">
        {vehicleTitle && (
          <h1 className="text-3xl font-bold text-black mb-4">
            {vehicleTitle}
          </h1>
        )}
        <div className="text-3xl font-bold text-[#35530A] mt-2">
          {price}
        </div>
      </div>
      <h2 className="text-lg font-bold mb-4 text-black">
        Dane techniczne
      </h2>
      <div className="grid grid-cols-2 gap-2 text-sm mb-6">
        {technicalData.filter(({ value }) => value).map(({ label, value }) => (
          <InfoRow key={label} label={label} value={value} />
        ))}
      </div>
      
      <h2 className="text-lg font-bold mb-4 text-black">
        Stan pojazdu
      </h2>
      <div className="grid grid-cols-2 gap-2 text-sm mb-6">
        {vehicleStatusData.filter(({ value }) => value).map(({ label, value }) => (
          <InfoRow key={label} label={label} value={value} />
        ))}
      </div>
      
      <h2 className="text-lg font-bold mb-4 text-black">
        Informacje dodatkowe
      </h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {additionalInfo.filter(({ value }) => value).map(({ label, value }) => (
          <InfoRow key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
};

export default TechnicalDetails;
