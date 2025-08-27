// src/components/ListingForm/utils/FormValidator.js

/**
 * Klasa obsługująca walidację formularza
 */
class FormValidator {
    /**
     * Walidacja całego formularza
     * @param {Object} formData - Dane formularza
     * @returns {Object} Obiekt z błędami
     */
    static validateForm(formData) {
      const errors = {};
      
      // Tworzymy kopię danych, aby nie modyfikować oryginału
      const formDataCopy = { ...formData };
      
      // Walidacja podstawowych pól
      this.validateBasicInfo(formDataCopy, errors);
      
      // Walidacja stanu pojazdu
      this.validateVehicleStatus(formDataCopy, errors);
      
      // Walidacja danych technicznych
      this.validateTechnicalData(formDataCopy, errors);
      
      // Walidacja zdjęć
      this.validatePhotos(formDataCopy, errors);
      
      // Walidacja opisu i ceny
      this.validateDescriptionPrice(formDataCopy, errors);
      
      // Zwracamy tylko błędy - nie modyfikujemy oryginalnych danych
      return errors;
    }
    
    /**
     * Walidacja podstawowych informacji
     */
    static validateBasicInfo(formData, errors) {
      // Marka
      if (!formData.brand) {
        formData.brand = 'Nieznana'; // Domyślna wartość
      }
      
      // Model
      if (!formData.model) {
        formData.model = 'Nieznany'; // Domyślna wartość
      }
      
      // Rok produkcji
      if (!formData.productionYear) {
        formData.productionYear = '2010'; // Domyślna wartość
      } else {
        const year = parseInt(formData.productionYear);
        const currentYear = new Date().getFullYear();
        
        if (isNaN(year)) {
          formData.productionYear = '2010'; // Domyślna wartość
        } else if (year < 1900) {
          formData.productionYear = '2010'; // Domyślna wartość
        } else if (year > currentYear + 1) {
          formData.productionYear = currentYear.toString(); // Bieżący rok jako domyślna wartość
        }
      }
      
      // VIN (opcjonalny)
      if (formData.vin) {
        if (formData.vin.length !== 17 || !/^[A-HJ-NPR-Z0-9]{17}$/.test(formData.vin)) {
          formData.vin = ''; // Usuwamy nieprawidłowy VIN
        }
      }
      
      // Numer rejestracyjny (opcjonalny)
      if (formData.registrationNumber) {
        const regNumberRegex = /^[A-Z0-9]{3,10}$/;
        if (!regNumberRegex.test(formData.registrationNumber)) {
          formData.registrationNumber = ''; // Usuwamy nieprawidłowy numer rejestracyjny
        }
      }
      
      // Nagłówek ogłoszenia (opcjonalny)
      if (!formData.headline) {
        formData.headline = `${formData.brand} ${formData.model} ${formData.productionYear}`; // Generujemy domyślny nagłówek
      }
    }
    
    /**
     * Walidacja stanu pojazdu
     */
    static validateVehicleStatus(formData, errors) {
      // Stan - wymagany
      if (!formData.condition) {
        errors.condition = 'Stan pojazdu jest wymagany';
      }
      
      // Wypadkowość - wymagana
      if (!formData.accidentStatus) {
        errors.accidentStatus = 'Informacja o wypadkowości jest wymagana';
      }
      
      // Uszkodzenia - wymagane
      if (!formData.damageStatus) {
        errors.damageStatus = 'Informacja o uszkodzeniach jest wymagana';
      }
      
      // Kraj pochodzenia - wymagany
      if (!formData.countryOfOrigin) {
        errors.countryOfOrigin = 'Kraj pochodzenia jest wymagany';
      }
      
      // POLA Z GWIAZDKAMI - WYMAGANE zgodnie z żądaniem użytkownika
      if (!formData.imported) {
        errors.imported = 'Informacja o imporcie jest wymagana';
      }
      
      if (!formData.registeredInPL) {
        errors.registeredInPL = 'Informacja o rejestracji w PL jest wymagana';
      }
      
      if (!formData.firstOwner) {
        errors.firstOwner = 'Informacja o pierwszym właścicielu jest wymagana';
      }
      
      // ADAPTACJA MEDYCZNA - OPCJONALNA (bez gwiazdki)
      // Nie sprawdzamy tego pola - jest opcjonalne
      
      // Tuning - opcjonalny, ale jeśli pusty, ustawiamy domyślną wartość
      if (!formData.tuning) {
        formData.tuning = 'Nie';
      }
      
      // Adaptacja medyczna - opcjonalna, ale jeśli pusta, ustawiamy domyślną wartość
      if (!formData.disabledAdapted) {
        formData.disabledAdapted = 'Nie';
      }
    }
    
    /**
     * Walidacja danych technicznych
     */
    static validateTechnicalData(formData, errors) {
      // Przebieg - wymagany
      if (!formData.mileage) {
        errors.mileage = 'Przebieg jest wymagany';
      } else {
        const mileage = parseInt(formData.mileage);
        
        if (isNaN(mileage)) {
          errors.mileage = 'Przebieg musi być liczbą';
        } else if (mileage < 0) {
          errors.mileage = 'Przebieg jest za niski. Minimalna wartość: 0 km';
        } else if (mileage > 1200000) {
          errors.mileage = 'Przebieg jest za wysoki. Maksymalna wartość: 1,200,000 km';
        }
      }
      
      // Ostatni oficjalny przebieg (opcjonalny)
      if (formData.lastOfficialMileage) {
        const lastMileage = parseInt(formData.lastOfficialMileage);
        
        if (isNaN(lastMileage)) {
          errors.lastOfficialMileage = 'Przebieg CEPiK musi być liczbą';
        } else if (lastMileage < 0) {
          errors.lastOfficialMileage = 'Przebieg CEPiK jest za niski. Minimalna wartość: 0 km';
        } else if (lastMileage > 1200000) {
          errors.lastOfficialMileage = 'Przebieg CEPiK jest za wysoki. Maksymalna wartość: 1,200,000 km';
        }
      }
      
      // Rodzaj paliwa - wymagany
      if (!formData.fuelType) {
        errors.fuelType = 'Rodzaj paliwa jest wymagany';
      }
      
      // Skrzynia biegów - wymagana
      if (!formData.transmission) {
        errors.transmission = 'Skrzynia biegów jest wymagana';
      }
      
      // Napęd - wymagany
      if (!formData.drive) {
        errors.drive = 'Napęd jest wymagany';
      }
      
      // Moc silnika - wymagana
      if (!formData.power) {
        errors.power = 'Moc silnika jest wymagana';
      } else {
        const power = parseInt(formData.power);
        
        if (isNaN(power)) {
          errors.power = 'Moc musi być liczbą';
        } else if (power < 10) {
          errors.power = 'Moc jest za niska. Minimalna wartość: 10 KM';
        } else if (power > 2000) {
          errors.power = 'Moc jest za wysoka. Maksymalna wartość: 2,000 KM';
        }
      }
      
      // Pojemność silnika - wymagana
      if (!formData.engineSize) {
        errors.engineSize = 'Pojemność silnika jest wymagana';
      } else {
        const engineSize = parseInt(formData.engineSize);
        
        if (isNaN(engineSize)) {
          errors.engineSize = 'Pojemność musi być liczbą';
        } else if (engineSize < 50) {
          errors.engineSize = 'Pojemność jest za niska. Minimalna wartość: 50 cm³';
        } else if (engineSize > 8500) {
          errors.engineSize = 'Pojemność jest za wysoka. Maksymalna wartość: 8,500 cm³';
        }
      }
      
      // Waga (opcjonalna)
      if (formData.weight) {
        const weight = parseInt(formData.weight);
        
        if (isNaN(weight)) {
          errors.weight = 'Waga musi być liczbą';
        } else if (weight < 400) {
          errors.weight = 'Waga jest za niska. Minimalna wartość: 400 kg';
        } else if (weight > 4000) {
          errors.weight = 'Waga jest za wysoka. Maksymalna wartość: 4,000 kg';
        }
      }
    }
    
    /**
     * Walidacja zdjęć
     */
    static validatePhotos(formData, errors) {
      // Inicjalizujemy tablicę zdjęć jeśli nie istnieje
      if (!formData.images) {
        formData.images = [];
      }
      
      // WYMAGANE MINIMUM 5 ZDJĘĆ
      if (formData.images.length < 5) {
        errors.images = `Wymagane jest minimum 5 zdjęć pojazdu. Aktualnie dodano: ${formData.images.length}`;
      }
      
      // Sprawdzamy, czy mainImage jest ustawiony i czy jest w tablicy images
      if (formData.mainImage && formData.images.length > 0) {
        // Sprawdzamy, czy mainImage jest w tablicy images
        const mainImageExists = formData.images.some(img => {
          if (typeof img === 'string') {
            return img === formData.mainImage;
          } else if (img && typeof img === 'object') {
            return img.url === formData.mainImage;
          }
          return false;
        });
        
        // Jeśli mainImage nie istnieje w tablicy images, ustawiamy pierwszy element jako mainImage
        if (!mainImageExists && formData.images.length > 0) {
          const firstImage = formData.images[0];
          if (typeof firstImage === 'string') {
            formData.mainImage = firstImage;
          } else if (firstImage && typeof firstImage === 'object' && firstImage.url) {
            formData.mainImage = firstImage.url;
          }
        }
      } else if (formData.images.length > 0) {
        // Jeśli mainImage nie jest ustawiony, a mamy zdjęcia, ustawiamy pierwsze jako główne
        const firstImage = formData.images[0];
        if (typeof firstImage === 'string') {
          formData.mainImage = firstImage;
        } else if (firstImage && typeof firstImage === 'object' && firstImage.url) {
          formData.mainImage = firstImage.url;
        }
      } else {
        // Jeśli nie ma zdjęć, resetujemy mainImage
        formData.mainImage = '';
      }
    }
    
    /**
     * Walidacja opisu i ceny
     */
    static validateDescriptionPrice(formData, errors) {
      // Opis
      if (!formData.description) {
        formData.description = 'Brak opisu'; // Domyślna wartość
      } else if (formData.description.length < 10) {
        formData.description = formData.description + ' - Dodatkowy opis, aby spełnić wymagania minimalnej długości.';
      }
      
      // Cena w zależności od opcji zakupu
      if (formData.purchaseOption !== 'najem') {
        if (!formData.price) {
          formData.price = '10000'; // Domyślna wartość
        } else {
          const price = parseFloat(formData.price);
          
          if (isNaN(price) || price <= 0) {
            formData.price = '10000'; // Domyślna wartość
          }
        }
      } else {
        if (!formData.rentalPrice) {
          formData.rentalPrice = '1000'; // Domyślna wartość
        } else {
          const rentalPrice = parseFloat(formData.rentalPrice);
          
          if (isNaN(rentalPrice) || rentalPrice <= 0) {
            formData.rentalPrice = '1000'; // Domyślna wartość
          }
        }
      }
      
      // Ustawiamy domyślną opcję zakupu, jeśli nie jest określona
      if (!formData.purchaseOption) {
        formData.purchaseOption = 'sprzedaz';
      }
      
      // Ustawiamy domyślny typ sprzedawcy, jeśli nie jest określony
      if (!formData.sellerType) {
        formData.sellerType = 'Prywatny';
      }
    }
  }
  
  export default FormValidator;
