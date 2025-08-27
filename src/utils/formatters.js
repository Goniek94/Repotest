// Funkcja formatowania nazw własnych (marki, modele, opcje)
export const formatProperName = (name) => {
  if (!name) return '';
  
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

// Funkcja formatowania tytułu pojazdu (marka + model)
export const formatVehicleTitle = (listing) => {
  const brand = formatProperName(listing.brand || listing.make || '');
  const model = formatProperName(listing.model || '');
  return `${brand} ${model}`.trim();
};

// Funkcja formatowania wartości logicznych
export const formatBooleanValue = (value, trueText = 'Tak', falseText = 'Nie') => {
  if (value === true || value === 'true' || value === 'tak') return trueText;
  if (value === false || value === 'false' || value === 'nie') return falseText;
  return value;
};
