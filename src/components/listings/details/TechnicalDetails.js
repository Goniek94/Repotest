import React from 'react';

const TechnicalDetails = ({ listing }) => {
  // Komponent pomocniczy do wyświetlania wiersza danych
  const InfoRow = ({ label, value }) => (
    <div className="p-2 bg-gray-50 rounded-sm">
      <div className="text-gray-600 font-medium">{label}</div>
      <div className="font-semibold text-black">{value || 'Nie podano'}</div>
    </div>
  );

  // Dane techniczne
  const technical = [
    { label: "Marka", value: listing.make || listing.brand },
    { label: "Model", value: listing.model },
    { label: "Generacja", value: listing.generation },
    { label: "Wersja", value: listing.version },
    { label: "Rok", value: listing.year?.toString() || listing.productionYear?.toString() },
    { label: "Paliwo", value: listing.fuelType || listing.fuel },
    { label: "Moc", value: listing.power ? `${listing.power} KM` : null },
    { label: "Pojemność", value: listing.engineSize ? `${listing.engineSize} cm³` : null },
    { label: "Skrzynia", value: listing.transmission },
    { label: "Napęd", value: listing.drive },
    { label: "Przebieg", value: listing.mileage ? `${listing.mileage.toLocaleString()} km` : null },
    { label: "Ostatni przebieg (CEPiK)", value: listing.lastOfficialMileage ? `${listing.lastOfficialMileage.toLocaleString()} km` : null },
    { label: "Waga", value: listing.weight ? `${listing.weight} kg` : null },
  ];

  // Dane nadwozia i wyposażenia
  const body = [
    { label: "Typ nadwozia", value: listing.bodyType },
    { label: "Kolor", value: listing.color },
    { label: "Liczba drzwi", value: listing.doors?.toString() },
    { label: "Stan techniczny", value: listing.condition },
    { label: "Wypadkowość", value: listing.accidentStatus },
    { label: "Uszkodzenia", value: listing.damageStatus },
    { label: "Tuning", value: listing.tuning },
    { label: "Importowany", value: listing.imported },
    { label: "Zarejestrowany w PL", value: listing.registeredInPL },
    { label: "Pierwszy właściciel", value: listing.firstOwner },
    { label: "Dla niepełnosprawnych", value: listing.disabledAdapted },
    { label: "Kraj pochodzenia", value: listing.countryOfOrigin },
    { label: "Typ sprzedawcy", value: listing.sellerType },
    { label: "Opcja zakupu", value: listing.purchaseOptions },
    { label: "Cena do negocjacji", value: listing.negotiable },
    { label: "Nr rejestracyjny", value: listing.registrationNumber },
    { label: "VIN", value: listing.vin },
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
        {technical.filter(({ value }) => value).map(({ label, value }) => (
          <InfoRow key={label} label={label} value={value} />
        ))}
      </div>
      <h2 className="text-lg font-bold mb-4 text-black">
        Nadwozie i wyposażenie
      </h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {body.filter(({ value }) => value).map(({ label, value }) => (
          <InfoRow key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
};

export default TechnicalDetails;
