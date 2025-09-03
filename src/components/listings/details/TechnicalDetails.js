import React from 'react';
import { Info } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';

const TechnicalDetails = ({ listing }) => {
  // Funkcja formatowania nazw miast
  const formatCityName = (cityName) => {
    if (!cityName) return '';
    
    // Lista słów, które powinny pozostać małe (przedimki, spójniki)
    const smallWords = ['i', 'na', 'nad', 'pod', 'w', 'z', 'ze', 'do', 'od', 'o'];
    
    return cityName
      .toLowerCase()
      .split(/[\s-]/)
      .map((word, index) => {
        // Pierwsza litera zawsze wielka, lub jeśli nie jest małym słowem
        if (index === 0 || !smallWords.includes(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join(cityName.includes('-') ? '-' : ' ');
  };

  // Funkcja formatowania wartości logicznych
  const formatBooleanValue = (value, trueText = 'Tak', falseText = 'Nie') => {
    if (value === true || value === 'true' || value === 'tak') return trueText;
    if (value === false || value === 'false' || value === 'nie') return falseText;
    return value;
  };

  // Funkcja formatowania nazw własnych (marki, modele, opcje)
  const formatProperName = (name) => {
    if (!name) return '';
    
    // Lista skrótów i nazw, które powinny być całkowicie wielkimi literami
    const allCapsWords = ['BMW', 'VW', 'KIA', 'MG', 'DS', 'SsangYong'];
    
    // Lista nazw, które mają specjalne formatowanie
    const specialCases = {
      'bmw': 'BMW',
      'vw': 'VW', 
      'volkswagen': 'Volkswagen',
      'mercedes': 'Mercedes',
      'mercedes-benz': 'Mercedes-Benz',
      'audi': 'Audi',
      'toyota': 'Toyota',
      'honda': 'Honda',
      'nissan': 'Nissan',
      'ford': 'Ford',
      'opel': 'Opel',
      'peugeot': 'Peugeot',
      'renault': 'Renault',
      'citroen': 'Citroën',
      'skoda': 'Škoda',
      'seat': 'SEAT',
      'fiat': 'Fiat',
      'alfa romeo': 'Alfa Romeo',
      'lancia': 'Lancia',
      'ferrari': 'Ferrari',
      'lamborghini': 'Lamborghini',
      'maserati': 'Maserati',
      'porsche': 'Porsche',
      'bentley': 'Bentley',
      'rolls-royce': 'Rolls-Royce',
      'jaguar': 'Jaguar',
      'land rover': 'Land Rover',
      'mini': 'MINI',
      'volvo': 'Volvo',
      'saab': 'Saab',
      'lexus': 'Lexus',
      'infiniti': 'Infiniti',
      'acura': 'Acura',
      'cadillac': 'Cadillac',
      'chevrolet': 'Chevrolet',
      'dodge': 'Dodge',
      'jeep': 'Jeep',
      'chrysler': 'Chrysler',
      'buick': 'Buick',
      'gmc': 'GMC',
      'lincoln': 'Lincoln',
      'kia': 'KIA',
      'hyundai': 'Hyundai',
      'genesis': 'Genesis',
      'mazda': 'Mazda',
      'subaru': 'Subaru',
      'mitsubishi': 'Mitsubishi',
      'suzuki': 'Suzuki',
      'isuzu': 'Isuzu',
      'dacia': 'Dacia',
      'lada': 'Lada',
      'mg': 'MG',
      'ds': 'DS',
      'ssangyong': 'SsangYong'
    };
    
    const lowerName = name.toLowerCase();
    
    // Sprawdź czy to specjalny przypadek
    if (specialCases[lowerName]) {
      return specialCases[lowerName];
    }
    
    // Standardowe formatowanie - pierwsza litera wielka
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Funkcja formatowania opcji wyboru
  const formatSelectOption = (option) => {
    if (!option) return '';
    // Specjalne przypadki dla niektórych opcji
    const specialCases = {
      'benzyna': 'Benzyna',
      'diesel': 'Diesel',
      'lpg': 'LPG',
      'cng': 'CNG',
      'elektryczny': 'Elektryczny',
      'hybryda': 'Hybryda',
      'manualna': 'Manualna',
      'automatyczna': 'Automatyczna',
      'cvt': 'CVT',
      'dsg': 'DSG',
      'przedni': 'Przedni',
      'tylny': 'Tylny',
      '4x4': '4x4',
      'awd': 'AWD',
      'faktura vat': 'Faktura VAT',
      'umowa kupna-sprzedaży': 'Umowa kupna-sprzedaży'
    };
    
    return specialCases[option.toLowerCase()] || formatProperName(option);
  };
  // Komponent pomocniczy do wyświetlania wiersza danych
  const InfoRow = ({ label, value, isMobile = false }) => (
    <div className="p-2 bg-gray-50 rounded-sm">
      <div className="text-gray-600 font-medium flex items-center gap-1">
        {label}
        {label === "Adaptacja medyczna" && (
          <Info 
            className={`text-gray-500 hover:text-[#35530A] cursor-help transition-colors ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} 
            title="Przystosowanie dla osób niepełnosprawnych" 
          />
        )}
      </div>
      <div className="font-semibold text-black">{value || 'Nie podano'}</div>
    </div>
  );

  // Dane techniczne - połączone z danymi nadwozia
  const technicalData = [
    { label: "Marka", value: formatProperName(listing.make || listing.brand) },
    { label: "Model", value: formatProperName(listing.model) },
    { label: "Generacja", value: formatProperName(listing.generation) },
    { label: "Wersja silnika", value: formatProperName(listing.version) },
    { label: "Rok produkcji", value: listing.year?.toString() || listing.productionYear?.toString() },
    { label: "Przebieg", value: listing.mileage ? `${listing.mileage.toLocaleString()} km` : null },
    { label: "Przebieg CEPiK", value: listing.lastOfficialMileage ? `${listing.lastOfficialMileage.toLocaleString()} km` : null },
    { label: "Paliwo", value: formatSelectOption(listing.fuelType || listing.fuel) },
    { label: "Moc", value: listing.power ? `${listing.power} KM` : null },
    { label: "Pojemność", value: listing.engineSize ? `${listing.engineSize} cm³` : null },
    { label: "Skrzynia", value: formatSelectOption(listing.transmission) },
    { label: "Napęd", value: formatSelectOption(listing.drive) },
    { label: "Waga", value: listing.weight ? `${listing.weight} kg` : null },
    { label: "Typ nadwozia", value: formatSelectOption(listing.bodyType) },
    { label: "Kolor", value: formatProperName(listing.color) },
    { label: "Liczba drzwi", value: listing.doors?.toString() },
    { label: "Liczba miejsc", value: listing.seats?.toString() },
    { label: "Wykończenie", value: formatProperName(listing.paintFinish || listing.finish) },
    { label: "Tuning", value: formatBooleanValue(listing.tuning) },
  ];

  // Stan pojazdu - zmieniona nazwa z "Stan techniczny"
  const vehicleStatusData = [
    { label: "Stan techniczny", value: formatSelectOption(listing.condition) },
    { label: "Pierwszy właściciel", value: formatBooleanValue(listing.firstOwner) },
    { label: "Importowany", value: formatBooleanValue(listing.imported) },
    { label: "Zarejestrowany w PL", value: formatBooleanValue(listing.registeredInPL) },
    { label: "Kraj pochodzenia", value: formatProperName(listing.countryOfOrigin) },
    { label: "Typ sprzedawcy", value: formatSelectOption(listing.sellerType) },
    { label: "Wypadkowość", value: formatSelectOption(listing.accidentStatus) },
    { label: "Uszkodzenia", value: formatSelectOption(listing.damageStatus) },
    { label: "Adaptacja medyczna", value: formatBooleanValue(listing.disabledAdapted), alwaysShow: true },
    { label: "VIN", value: listing.vin?.toUpperCase() },
    { label: "Nr rejestracyjny", value: listing.registrationNumber?.toUpperCase() },
    { label: "Data pierwszej rejestracji", value: listing.firstRegistrationDate },
  ];

  // Informacje dodatkowe - połączone z informacjami o cesji i zamianie
  const additionalInfo = [
    { label: "Cena do negocjacji", value: formatBooleanValue(listing.negotiable) },
    { label: "Opcja zakupu", value: formatSelectOption(listing.purchaseOptions) },
    { label: "Cena najmu", value: listing.rentalPrice ? `${listing.rentalPrice.toLocaleString()} zł/miesiąc` : null },
    // Informacje o cesji - dodawane gdy wybrano cesję
    ...(listing.purchaseOptions === 'Cesja leasingu' ? [
      { label: "Firma leasingowa/bank", value: listing.leasingCompany },
      { label: "Pozostałe raty", value: listing.remainingInstallments ? `${listing.remainingInstallments} rat` : null },
      { label: "Wysokość raty", value: listing.installmentAmount ? `${listing.installmentAmount.toLocaleString()} zł/miesiąc` : null },
      { label: "Opłata za cesję", value: listing.cessionFee ? `${listing.cessionFee.toLocaleString()} zł` : null },
    ].filter(({ value }) => value) : []),
    // Informacje o zamianie - dodawane gdy wybrano zamianę
    ...(listing.purchaseOptions === 'Zamiana' ? [
      { label: "Oferuje w zamian", value: listing.exchangeOffer },
      { label: "Wartość oferowanego pojazdu", value: listing.exchangeValue ? `${listing.exchangeValue.toLocaleString()} zł` : null },
      { label: "Dopłata", value: listing.exchangePayment ? `${listing.exchangePayment.toLocaleString()} zł` : null },
      { label: "Warunki zamiany", value: listing.exchangeConditions },
    ].filter(({ value }) => value) : [])
  ];

  // Pobierz dane potrzebne do nagłówka
  const brand = formatProperName(listing.make || listing.brand) || '';
  const model = formatProperName(listing.model) || '';
  const vehicleTitle = `${brand} ${model}`.trim();
  
  // Logika wyświetlania ceny w zależności od opcji zakupu
  const getPriceDisplay = () => {
    if (listing.purchaseOptions === 'Cesja leasingu') {
      // Jeśli jest opłata za cesję, pokaż ją jako cenę z informacją o cesji
      if (listing.cessionFee && listing.cessionFee > 0) {
        return `${listing.cessionFee.toLocaleString()} zł (Cesja)`;
      } else {
        return 'Cena do uzgodnienia';
      }
    } else if (listing.purchaseOptions === 'Zamiana') {
      return 'Zamiana';
    } else if (listing.purchaseOptions === 'Najem') {
      return listing.rentalPrice ? `${listing.rentalPrice.toLocaleString()} zł/miesiąc` : 'Najem - cena do uzgodnienia';
    } else {
      return listing.price ? `${listing.price.toLocaleString()} zł` : "Cena na żądanie";
    }
  };
  
  const price = getPriceDisplay();
  
  // Formatowanie lokalizacji
  const formattedCity = formatCityName(listing.city);
  const locationText = formattedCity && listing.voivodeship 
    ? `${formattedCity}, woj. ${listing.voivodeship}`
    : formattedCity || listing.voivodeship || '';

  return (
    <>
      {/* Desktop Layout - unchanged */}
      <div className="hidden lg:block bg-white p-6 shadow-md rounded-sm">
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
          Informacje o pojeździe
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm mb-6">
          {vehicleStatusData.filter(({ value, alwaysShow }) => value || alwaysShow).map(({ label, value }) => (
            <InfoRow key={label} label={label} value={value} />
          ))}
        </div>
        
        <h2 className="text-lg font-bold mb-4 text-black">
          Informacje sprzedażowe
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {additionalInfo.filter(({ value }) => value).map(({ label, value }) => (
            <InfoRow key={label} label={label} value={value} />
          ))}
        </div>
      </div>

      {/* Mobile Layout - with collapsible sections */}
      <div className="lg:hidden space-y-4">
        {/* Technical data - collapsible, default open */}
        <CollapsibleSection 
          title="Dane techniczne" 
          defaultOpen={true}
          contentClassName="pt-4"
        >
          <div className="grid grid-cols-2 gap-2 text-sm">
            {technicalData.filter(({ value }) => value).map(({ label, value }) => (
              <InfoRow key={label} label={label} value={value} isMobile={true} />
            ))}
          </div>
        </CollapsibleSection>
        
        {/* Vehicle status - collapsible, default closed */}
        <CollapsibleSection 
          title="Informacje o pojeździe" 
          defaultOpen={false}
          contentClassName="pt-4"
        >
          <div className="grid grid-cols-2 gap-2 text-sm">
            {vehicleStatusData.filter(({ value, alwaysShow }) => value || alwaysShow).map(({ label, value }) => (
              <InfoRow key={label} label={label} value={value} isMobile={true} />
            ))}
          </div>
        </CollapsibleSection>
        
        {/* Sales information - collapsible, default closed */}
        <CollapsibleSection 
          title="Informacje sprzedażowe" 
          defaultOpen={false}
          contentClassName="pt-4"
        >
          <div className="grid grid-cols-2 gap-2 text-sm">
            {additionalInfo.filter(({ value }) => value).map(({ label, value }) => (
              <InfoRow key={label} label={label} value={value} isMobile={true} />
            ))}
          </div>
        </CollapsibleSection>
      </div>
    </>
  );
};

export default TechnicalDetails;
