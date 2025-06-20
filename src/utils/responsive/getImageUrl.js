/**
 * Zwraca poprawny URL do zdjęcia, obsługuje różne formaty:
 * - pełne URL-e (http://, https://)
 * - URL-e Cloudinary (res.cloudinary.com)
 * - lokalne ścieżki (/uploads/)
 * - brak zdjęcia
 * 
 * @param {string} image - ścieżka lub URL do zdjęcia
 * @returns {string|null} - poprawny URL do zdjęcia lub null jeśli brak zdjęcia
 */
const getImageUrl = (image) => {
  try {
    // Jeśli brak zdjęcia lub jest undefined/null, zwróć null
    if (!image) {
      console.log('getImageUrl: brak zdjęcia (null/undefined)');
      return null;
    }
    
    // Dodajemy logowanie dla debugowania
    console.log('getImageUrl otrzymał:', image);
    
    // Sprawdź, czy image jest stringiem
    if (typeof image !== 'string') {
      console.error('getImageUrl: otrzymano nieprawidłowy typ danych:', typeof image);
      
      // Jeśli to tablica, spróbuj użyć pierwszego elementu
      if (Array.isArray(image) && image.length > 0) {
        console.log('getImageUrl: próba użycia pierwszego elementu tablicy');
        return getImageUrl(image[0]);
      }
      
      // Jeśli to obiekt, spróbuj przekonwertować na string
      if (typeof image === 'object') {
        console.log('getImageUrl: próba konwersji obiektu na string');
        const imageStr = String(image);
        if (imageStr !== '[object Object]') {
          return getImageUrl(imageStr);
        }
      }
      
      return null;
    }
    
    // Jeśli to URL Cloudinary, zwróć go bez zmian
    if (image.includes('res.cloudinary.com')) {
      console.log('Rozpoznano URL Cloudinary:', image);
      return image;
    }
    
    // Jeśli to pełny URL (http, https), zwróć go bez zmian
    if (image.startsWith("http://") || image.startsWith("https://")) {
      console.log('Rozpoznano pełny URL:', image);
      return image;
    }

    // Pobierz host backendu z env lub użyj domyślnego adresu
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    console.log('Używam API URL:', apiUrl);
    
    // Obsługa lokalnych ścieżek
    if (image.startsWith("/uploads/")) {
      const fullUrl = `${apiUrl}${image}`;
      console.log('Rozpoznano ścieżkę /uploads/, pełny URL:', fullUrl);
      return fullUrl;
    }
    
    if (image.startsWith("uploads/")) {
      const fullUrl = `${apiUrl}/${image}`;
      console.log('Rozpoznano ścieżkę uploads/, pełny URL:', fullUrl);
      return fullUrl;
    }
    
    // Sprawdź, czy ścieżka zawiera nazwę pliku z rozszerzeniem
    const hasFileExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(image);
    
    // Jeśli nie ma rozszerzenia pliku, może to być nieprawidłowa ścieżka
    if (!hasFileExtension) {
      console.warn(`Ostrzeżenie: Ścieżka obrazu "${image}" nie zawiera rozszerzenia pliku.`);
      
      // Próba naprawy - sprawdź, czy to może być ID zdjęcia
      if (image.length > 10 && !image.includes('/')) {
        // Może to być ID zdjęcia, spróbuj dodać rozszerzenie
        const fullUrl = `${apiUrl}/uploads/${image}.jpg`;
        console.log('Próba naprawy - dodanie rozszerzenia .jpg:', fullUrl);
        return fullUrl;
      }
      
      return null;
    }
    
    // Domyślna obsługa - dodaj /uploads/ do ścieżki
    const fullUrl = `${apiUrl}/uploads/${image.replace(/^\/?/, "")}`;
    console.log('Domyślna obsługa, pełny URL:', fullUrl);
    return fullUrl;
  } catch (error) {
    console.error("Błąd w getImageUrl:", error, "dla obrazu:", image);
    return null;
  }
};

export default getImageUrl;
