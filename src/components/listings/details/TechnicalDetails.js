import React from 'react';

const TechnicalDetails = ({ listing }) => {
  // Komponent pomocniczy do wyświetlania wiersza danych
  const InfoRow = ({ label, value }) => (
    <div className="p-2 bg-gray-50 rounded-sm">
      <div className="text-gray-600 font-medium">{label}</div>
      <div className="font-semibold text-black">{value || 'Nie podano'}</div>
    </div>
  );

  // Dane techniczne (zgodnie z excelekiem)
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
    { label: "Przebieg cepik", value: listing.lastOfficialMileage ? `${listing.lastOfficialMileage.toLocaleString()} km` : null },
  ];

  // Dane nadwozia i wyposażenia
  const body = [
    { label: "Typ nadwozia", value: listing.bodyType },
    { label: "Kolor", value: listing.color },
    { label: "Stan techniczny", value: listing.condition },
    { label: "Uszkodzenia", value: listing.damageStatus },
    { label: "Liczba miejsc", value: listing.seats?.toString() },
    { label: "Liczba drzwi", value: listing.doors?.toString() },
    { label: "Kraj pochodzenia", value: listing.countryOfOrigin },
    { label: "Tuning", value: listing.tuning },
    { label: "Kierownica po prawej", value: listing.steeringWheelOnRight ? "Tak" : (listing.steeringWheelOnRight === false ? "Nie" : null) },
    { label: "Niepełnosprawni", value: listing.disabledAdapted },
  ];

  // Pobierz dane potrzebne do nagłówka
  const brand = listing.make || listing.brand || '';
  const model = listing.model || '';
  const vehicleTitle = `${brand} ${model}`.trim();
  const price = listing.price ? `${listing.price.toLocaleString()} zł` : "Cena na żądanie";
  const sellerType = listing.sellerType === "company" ? "Firma" : "Osoba prywatna";

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
        {technical.map(({ label, value }) =>
          value ? <InfoRow key={label} label={label} value={value} /> : null
        )}
      </div>
      <h2 className="text-lg font-bold mb-4 text-black">
        Nadwozie i wyposażenie
      </h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {body.map(({ label, value }) =>
          value ? <InfoRow key={label} label={label} value={value} /> : null
        )}
      </div>
    </div>
  );
};

export default TechnicalDetails;
