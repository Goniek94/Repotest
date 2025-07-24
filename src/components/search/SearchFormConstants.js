// SearchFormConstants.js
// All static data for the search form
import {
  BODY_TYPES,
  COLORS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  DRIVE_TYPES,
  COUNTRIES
} from '../../constants/vehicleOptions';

// Mapowanie województw do miast
export const regionToCities = {
  'Dolnośląskie': ['Wrocław', 'Wałbrzych', 'Legnica', 'Jelenia Góra', 'Lubin', 'Głogów', 'Świdnica', 'Bolesławiec', 'Oleśnica', 'Dzierżoniów'],
  'Kujawsko-pomorskie': ['Bydgoszcz', 'Toruń', 'Włocławek', 'Grudziądz', 'Inowrocław', 'Brodnica', 'Świecie', 'Chełmno', 'Nakło nad Notecią', 'Rypin'],
  'Lubelskie': ['Lublin', 'Zamość', 'Chełm', 'Biała Podlaska', 'Puławy', 'Świdnik', 'Kraśnik', 'Łuków', 'Biłgoraj', 'Lubartów'],
  'Lubuskie': ['Zielona Góra', 'Gorzów Wielkopolski', 'Nowa Sól', 'Żary', 'Żagań', 'Świebodzin', 'Międzyrzecz', 'Sulechów', 'Słubice', 'Gubin'],
  'Łódzkie': ['Łódź', 'Piotrków Trybunalski', 'Pabianice', 'Tomaszów Mazowiecki', 'Bełchatów', 'Zgierz', 'Skierniewice', 'Radomsko', 'Kutno', 'Sieradz'],
  'Małopolskie': ['Kraków', 'Tarnów', 'Nowy Sącz', 'Oświęcim', 'Chrzanów', 'Olkusz', 'Nowy Targ', 'Bochnia', 'Gorlice', 'Zakopane'],
  'Mazowieckie': ['Warszawa', 'Radom', 'Płock', 'Siedlce', 'Pruszków', 'Legionowo', 'Ostrołęka', 'Piaseczno', 'Ciechanów', 'Żyrardów'],
  'Opolskie': ['Opole', 'Kędzierzyn-Koźle', 'Nysa', 'Brzeg', 'Kluczbork', 'Prudnik', 'Strzelce Opolskie', 'Krapkowice', 'Głubczyce', 'Namysłów'],
  'Podkarpackie': ['Rzeszów', 'Przemyśl', 'Stalowa Wola', 'Mielec', 'Tarnobrzeg', 'Krosno', 'Dębica', 'Jarosław', 'Sanok', 'Jasło'],
  'Podlaskie': ['Białystok', 'Suwałki', 'Łomża', 'Augustów', 'Bielsk Podlaski', 'Hajnówka', 'Grajewo', 'Zambrów', 'Sokółka', 'Mońki'],
  'Pomorskie': ['Gdańsk', 'Gdynia', 'Słupsk', 'Tczew', 'Starogard Gdański', 'Wejherowo', 'Rumia', 'Chojnice', 'Malbork', 'Kwidzyn'],
  'Śląskie': ['Katowice', 'Częstochowa', 'Sosnowiec', 'Gliwice', 'Zabrze', 'Bielsko-Biała', 'Bytom', 'Rybnik', 'Ruda Śląska', 'Tychy'],
  'Świętokrzyskie': ['Kielce', 'Ostrowiec Świętokrzyski', 'Starachowice', 'Skarżysko-Kamienna', 'Sandomierz', 'Końskie', 'Jędrzejów', 'Busko-Zdrój', 'Staszów', 'Pińczów'],
  'Warmińsko-mazurskie': ['Olsztyn', 'Elbląg', 'Ełk', 'Ostróda', 'Iława', 'Giżycko', 'Kętrzyn', 'Szczytno', 'Bartoszyce', 'Mrągowo'],
  'Wielkopolskie': ['Poznań', 'Kalisz', 'Konin', 'Piła', 'Ostrów Wielkopolski', 'Gniezno', 'Leszno', 'Swarzędz', 'Śrem', 'Krotoszyn'],
  'Zachodniopomorskie': ['Szczecin', 'Koszalin', 'Stargard', 'Kołobrzeg', 'Świnoujście', 'Szczecinek', 'Police', 'Wałcz', 'Białogard', 'Goleniów']
};

// carData will be loaded dynamically from backend API
// Dodajemy pusty obiekt jako fallback
export const carData = {}; // Fallback dla statycznych danych

export const bodyTypes = BODY_TYPES;

export const advancedOptions = {
  damageStatus: ['Brak uszkodzeń', 'Lekko uszkodzony', 'Poważnie uszkodzony', 'Uszkodzony', 'Bezwypadkowy'],
  country: COUNTRIES,
  fuelType: FUEL_TYPES,
  driveType: DRIVE_TYPES,
  transmission: TRANSMISSION_TYPES,
  color: COLORS,
  doorCount: ['2/3', '4/5', '6/7'],
  tuning: ['Tak', 'Nie'],
  vehicleCondition: ['Używany', 'Nowy', 'Powypadkowy', 'Uszkodzony', 'Do remontu', 'Bezwypadkowy'],
  sellingForm: ['Sprzedaż', 'Zamiana', 'Wynajem', 'Leasing'],
  sellerType: ['Prywatny', 'Firma', 'Dealer', 'Komis'],
  vehicleStatus: ['Uszkodzony', 'Bezwypadkowy', 'Kierownica po prawej', 'Przystosowany dla niepełnosprawnych', 'Pierwszy właściciel', 'Serwisowany w ASO', 'Zarejestrowany w Polsce', 'Sprowadzony'],
};

export const regions = [
  'Dolnośląskie', 'Kujawsko-pomorskie', 'Lubelskie', 'Lubuskie', 'Łódzkie', 
  'Małopolskie', 'Mazowieckie', 'Opolskie', 'Podkarpackie', 'Podlaskie',
  'Pomorskie', 'Śląskie', 'Świętokrzyskie', 'Warmińsko-mazurskie', 'Wielkopolskie', 'Zachodniopomorskie'
];

/**
 * Funkcja generująca listę lat do filtrów rocznika pojazdu
 * @param {number} startYear - Rok początkowy (domyślnie 1970)
 * @returns {Array} - Tablica lat od startYear do obecnego roku, w kolejności malejącej
 */
export const generateYearOptions = (startYear = 1970) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  
  return years;
};
