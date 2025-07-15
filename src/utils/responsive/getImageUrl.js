/**
 * Zwraca poprawny URL do zdjęcia lub domyślne zdjęcie, jeśli nie można przetworzyć podanego URL.
 * Obsługuje różne formaty:
 * - pełne URL-e (http://, https://)
 * - URL-e Cloudinary (cloudinary.com)
 * - URL-e Supabase (supabase.co)
 * - lokalne ścieżki (/uploads/)
 * 
 * WAŻNE: Funkcja jest zaprojektowana tak, aby NIE modyfikować poprawnych URL-i,
 * tylko uzupełniać ścieżki, które tego wymagają.
 * 
 * @param {string|array|object} image - ścieżka, URL lub obiekt zdjęcia
 * @returns {string} - poprawny URL do zdjęcia lub domyślne zdjęcie
 */
const getImageUrl = (image) => {
  // Domyślne zdjęcie placeholder
  const defaultImage = 'https://via.placeholder.com/400x300/cccccc/666666?text=Brak+zdjęcia';
  
  // DEBUG: Logowanie oryginalnego URL
  console.log('🔍 getImageUrl - Original image URL:', image);
  
  try {
    // Jeśli brak zdjęcia lub jest undefined/null, zwróć domyślne zdjęcie
    if (!image) {
      console.log('❌ getImageUrl - No image provided, returning default');
      return defaultImage;
    }
    
    // Sprawdź, czy image jest stringiem
    if (typeof image !== 'string') {
      // Jeśli to tablica, spróbuj użyć pierwszego elementu
      if (Array.isArray(image) && image.length > 0) {
        return getImageUrl(image[0]);
      }
      
      // Jeśli to obiekt, spróbuj przekonwertować na string
      if (typeof image === 'object') {
        const imageStr = String(image);
        if (imageStr !== '[object Object]') {
          return getImageUrl(imageStr);
        }
      }
      
      return defaultImage;
    }
    
    // Usuń białe znaki z początku i końca
    const cleanImage = image.trim();
    
    // Jeśli pusty string po oczyszczeniu
    if (!cleanImage) {
      return defaultImage;
    }
    
    // Jeśli to już pełny URL (HTTP/HTTPS), zwróć go bez zmian
    if (cleanImage.startsWith('http://') || cleanImage.startsWith('https://')) {
      console.log('✅ getImageUrl - Full URL detected, returning as-is:', cleanImage);
      return cleanImage;
    }
    
    // Jeśli to base64 data URL, zwróć go bez zmian
    if (cleanImage.startsWith('data:')) {
      return cleanImage;
    }
    
    // Jeśli to URL Cloudinary, Supabase lub inne zewnętrzne serwisy, zwróć bez zmian
    if (cleanImage.includes('cloudinary.com') || 
        cleanImage.includes('supabase.co') ||
        cleanImage.includes('amazonaws.com')) {
      return cleanImage;
    }

    // Pobierz host backendu z env lub użyj domyślnego adresu
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    // Obsługa lokalnych ścieżek
    if (cleanImage.startsWith('/uploads/')) {
      return `${apiUrl}${cleanImage}`;
    }
    
    if (cleanImage.startsWith('uploads/')) {
      return `${apiUrl}/${cleanImage}`;
    }
    
    // Sprawdź, czy ścieżka zawiera nazwę pliku z rozszerzeniem
    const hasFileExtension = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(cleanImage);
    
    // Jeśli nie ma rozszerzenia pliku, może to być nieprawidłowa ścieżka
    if (!hasFileExtension) {
      // Próba naprawy - sprawdź, czy to może być ID zdjęcia
      if (cleanImage.length > 10 && !cleanImage.includes('/') && !cleanImage.includes(' ')) {
        return `${apiUrl}/uploads/${cleanImage}.jpg`;
      }
      
      return defaultImage;
    }
    
    // Domyślna obsługa - dodaj /uploads/ do ścieżki
    const cleanPath = cleanImage.replace(/^\/+/, ''); // usuń początkowe slashe
    const finalUrl = `${apiUrl}/uploads/${cleanPath}`;
    console.log('🔧 getImageUrl - Final processed URL:', finalUrl);
    return finalUrl;
    
  } catch (error) {
    console.error('❌ getImageUrl: Błąd podczas przetwarzania URL zdjęcia:', error);
    return defaultImage;
  }
};

export default getImageUrl;
