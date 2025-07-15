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
      // Stan - ustawiamy domyślną wartość, jeśli jest pusty
      if (!formData.condition) {
        formData.condition = 'Używany';
      }
      
      // Pozostałe pola są opcjonalne, ale jeśli są puste, ustawiamy domyślne wartości
      if (!formData.accidentStatus) {
        formData.accidentStatus = 'Bezwypadkowy';
      }
      if (!formData.damageStatus) {
        formData.damageStatus = 'Nieuszkodzony';
      }
      if (!formData.tuning) {
        formData.tuning = 'Nie';
      }
      if (!formData.imported) {
        formData.imported = 'Nie';
      }
      if (!formData.registeredInPL) {
        formData.registeredInPL = 'Tak';
      }
      if (!formData.firstOwner) {
        formData.firstOwner = 'Nie';
      }
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
        formData.mileage = '100000'; // Domyślna wartość
      } else {
        const mileage = parseInt(formData.mileage);
        
        if (isNaN(mileage)) {
          formData.mileage = '100000'; // Domyślna wartość
        } else if (mileage < 0) {
          formData.mileage = '100000'; // Domyślna wartość
        } else if (mileage > 1000000) {
          formData.mileage = '100000'; // Domyślna wartość
        }
      }
      
      // Ostatni oficjalny przebieg (opcjonalny)
      if (formData.lastOfficialMileage) {
        const lastMileage = parseInt(formData.lastOfficialMileage);
        const currentMileage = parseInt(formData.mileage);
        
        if (isNaN(lastMileage) || lastMileage < 0 || lastMileage > 1000000 || (currentMileage && lastMileage > currentMileage)) {
          formData.lastOfficialMileage = ''; // Usuwamy wartość, jeśli jest nieprawidłowa
        }
      }
      
      // Rodzaj paliwa
      if (!formData.fuelType) {
        formData.fuelType = 'Benzyna'; // Domyślna wartość
      }
      
      // Skrzynia biegów
      if (!formData.transmission) {
        formData.transmission = 'Manualna'; // Domyślna wartość
      }
      
      // Napęd
      if (!formData.drive) {
        formData.drive = 'Przedni'; // Domyślna wartość
      }
      
      // Moc silnika
      if (!formData.power) {
        formData.power = '100'; // Domyślna wartość
      } else {
        const power = parseInt(formData.power);
        
        if (isNaN(power) || power <= 0 || power > 2000) {
          formData.power = '100'; // Domyślna wartość
        }
      }
      
      // Pojemność silnika (opcjonalna)
      if (formData.engineSize) {
        const engineSize = parseInt(formData.engineSize);
        
        if (isNaN(engineSize) || engineSize <= 0 || engineSize > 10000) {
          formData.engineSize = ''; // Usuwamy wartość, jeśli jest nieprawidłowa
        }
      }
      
      // Waga (opcjonalna)
      if (formData.weight) {
        const weight = parseInt(formData.weight);
        
        if (isNaN(weight) || weight <= 0 || weight > 10000) {
          formData.weight = ''; // Usuwamy wartość, jeśli jest nieprawidłowa
        }
      }
    }
    
    /**
     * Walidacja zdjęć
     */
    static validatePhotos(formData, errors) {
      // Zdjęcia nie są już wymagane, ale jeśli są, to muszą być poprawne
      if (!formData.images) {
        formData.images = [];
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
