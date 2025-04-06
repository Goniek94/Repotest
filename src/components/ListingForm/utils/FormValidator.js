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
      
      // Walidacja podstawowych pól
      this.validateBasicInfo(formData, errors);
      
      // Walidacja stanu pojazdu
      this.validateVehicleStatus(formData, errors);
      
      // Walidacja danych technicznych
      this.validateTechnicalData(formData, errors);
      
      // Walidacja zdjęć
      this.validatePhotos(formData, errors);
      
      // Walidacja opisu i ceny
      this.validateDescriptionPrice(formData, errors);
      
      return errors;
    }
    
    /**
     * Walidacja podstawowych informacji
     */
    static validateBasicInfo(formData, errors) {
      // Marka
      if (!formData.brand) {
        errors.brand = 'Marka jest wymagana';
      }
      
      // Model
      if (!formData.model) {
        errors.model = 'Model jest wymagany';
      }
      
      // Rok produkcji
      if (!formData.productionYear) {
        errors.productionYear = 'Rok produkcji jest wymagany';
      } else {
        const year = parseInt(formData.productionYear);
        const currentYear = new Date().getFullYear();
        
        if (isNaN(year)) {
          errors.productionYear = 'Rok produkcji musi być liczbą';
        } else if (year < 1900) {
          errors.productionYear = 'Rok produkcji nie może być wcześniejszy niż 1900';
        } else if (year > currentYear + 1) { // Uwzględniamy auta z przyszłego rocznika
          errors.productionYear = `Rok produkcji nie może być późniejszy niż ${currentYear + 1}`;
        }
      }
      
      // VIN (opcjonalny, ale jeśli jest, musi być prawidłowy)
      if (formData.vin) {
        if (formData.vin.length !== 17) {
          errors.vin = 'VIN musi mieć dokładnie 17 znaków';
        } else {
          // Walidacja poprawności VIN (podstawowe reguły)
          const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/; // VIN nie zawiera liter I, O, Q
          if (!vinRegex.test(formData.vin)) {
            errors.vin = 'VIN zawiera niedozwolone znaki';
          }
        }
      }
      
      // Numer rejestracyjny (opcjonalny, ale jeśli jest, musi być prawidłowy)
      if (formData.registrationNumber) {
        const regNumberRegex = /^[A-Z0-9]{3,10}$/;
        if (!regNumberRegex.test(formData.registrationNumber)) {
          errors.registrationNumber = 'Nieprawidłowy format numeru rejestracyjnego';
        }
      }
    }
    
    /**
     * Walidacja stanu pojazdu
     */
    static validateVehicleStatus(formData, errors) {
      // Stan
      if (!formData.condition) {
        errors.condition = 'Stan pojazdu jest wymagany';
      }
    }
    
    /**
     * Walidacja danych technicznych
     */
    static validateTechnicalData(formData, errors) {
      // Przebieg
      if (!formData.mileage) {
        errors.mileage = 'Przebieg jest wymagany';
      } else {
        const mileage = parseInt(formData.mileage);
        
        if (isNaN(mileage)) {
          errors.mileage = 'Przebieg musi być liczbą';
        } else if (mileage < 0) {
          errors.mileage = 'Przebieg nie może być ujemny';
        } else if (mileage > 1000000) {
          errors.mileage = 'Przebieg wydaje się zbyt duży (max 1 000 000 km)';
        }
      }
      
      // Ostatni oficjalny przebieg (opcjonalny, ale musi być prawidłowy)
      if (formData.lastOfficialMileage) {
        const lastMileage = parseInt(formData.lastOfficialMileage);
        const currentMileage = parseInt(formData.mileage);
        
        if (isNaN(lastMileage)) {
          errors.lastOfficialMileage = 'Przebieg musi być liczbą';
        } else if (lastMileage < 0) {
          errors.lastOfficialMileage = 'Przebieg nie może być ujemny';
        } else if (lastMileage > 1000000) {
          errors.lastOfficialMileage = 'Przebieg wydaje się zbyt duży (max 1 000 000 km)';
        } else if (currentMileage && lastMileage > currentMileage) {
          errors.lastOfficialMileage = 'Ostatni oficjalny przebieg nie może być większy niż aktualny';
        }
      }
      
      // Rodzaj paliwa
      if (!formData.fuelType) {
        errors.fuelType = 'Rodzaj paliwa jest wymagany';
      }
      
      // Skrzynia biegów
      if (!formData.transmission) {
        errors.transmission = 'Skrzynia biegów jest wymagana';
      }
      
      // Napęd (opcjonalny, ale dobrze mieć)
      if (!formData.drive) {
        errors.drive = 'Rodzaj napędu jest wymagany';
      }
      
      // Moc silnika
      if (!formData.power) {
        errors.power = 'Moc silnika jest wymagana';
      } else {
        const power = parseInt(formData.power);
        
        if (isNaN(power)) {
          errors.power = 'Moc silnika musi być liczbą';
        } else if (power <= 0) {
          errors.power = 'Moc silnika musi być liczbą dodatnią';
        } else if (power > 2000) {
          errors.power = 'Moc silnika wydaje się zbyt duża (max 2000 KM)';
        }
      }
      
      // Pojemność silnika (opcjonalna, ale jeśli jest, musi być dodatnia)
      if (formData.engineSize) {
        const engineSize = parseInt(formData.engineSize);
        
        if (isNaN(engineSize)) {
          errors.engineSize = 'Pojemność silnika musi być liczbą';
        } else if (engineSize <= 0) {
          errors.engineSize = 'Pojemność silnika musi być liczbą dodatnią';
        } else if (engineSize > 10000) {
          errors.engineSize = 'Pojemność silnika wydaje się zbyt duża (max 10000 cm³)';
        }
      }
      
      // Waga (opcjonalna, ale jeśli jest, musi być dodatnia)
      if (formData.weight) {
        const weight = parseInt(formData.weight);
        
        if (isNaN(weight)) {
          errors.weight = 'Waga musi być liczbą';
        } else if (weight <= 0) {
          errors.weight = 'Waga musi być liczbą dodatnią';
        } else if (weight > 10000) {
          errors.weight = 'Waga wydaje się zbyt duża (max 10000 kg)';
        }
      }
    }
    
    /**
     * Walidacja zdjęć
     */
    static validatePhotos(formData, errors) {
      // Sprawdzenie czy są zdjęcia
      if (!formData.photos || formData.photos.length === 0) {
        errors.photos = 'Dodaj przynajmniej jedno zdjęcie';
      }
    }
    
    /**
     * Walidacja opisu i ceny
     */
    static validateDescriptionPrice(formData, errors) {
      // Opis
      if (!formData.description) {
        errors.description = 'Opis jest wymagany';
      } else if (formData.description.length < 10) {
        errors.description = 'Opis musi zawierać co najmniej 10 znaków';
      }
      
      // Cena w zależności od opcji zakupu
      if (formData.purchaseOption !== 'najem') {
        if (!formData.price) {
          errors.price = 'Cena jest wymagana';
        } else {
          const price = parseFloat(formData.price);
          
          if (isNaN(price) || price <= 0) {
            errors.price = 'Cena musi być liczbą dodatnią';
          }
        }
      } else {
        if (!formData.rentalPrice) {
          errors.rentalPrice = 'Cena najmu jest wymagana';
        } else {
          const rentalPrice = parseFloat(formData.rentalPrice);
          
          if (isNaN(rentalPrice) || rentalPrice <= 0) {
            errors.rentalPrice = 'Cena najmu musi być liczbą dodatnią';
          }
        }
      }
    }
  }
  
  export default FormValidator;