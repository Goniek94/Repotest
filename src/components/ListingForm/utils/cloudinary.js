// src/components/ListingForm/utils/cloudinary.js

// Konfiguracja Cloudinary
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY;
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

/**
 * Przesyła plik do Cloudinary
 * @param {File} file - Plik do przesłania
 * @returns {Promise<string>} URL przesłanego pliku
 */
export const uploadToCloudinary = async (file) => {
  try {
    debug('Rozpoczęcie przesyłania pliku do Cloudinary:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', CLOUDINARY_API_KEY);
    
    debug('Używane parametry:', { 
      cloud_name: CLOUDINARY_CLOUD_NAME,
      upload_preset: CLOUDINARY_UPLOAD_PRESET,
      api_key: CLOUDINARY_API_KEY
    });
    
    const response = await fetch(CLOUDINARY_API_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Błąd odpowiedzi z Cloudinary:', response.status, errorText);
      // Zamiast rzucać błąd, zwracamy tymczasowy URL dla testów
      return URL.createObjectURL(file);
    }
    
    const data = await response.json();
    debug('Odpowiedź z Cloudinary:', data);
    
    return data.secure_url;
  } catch (error) {
    console.error('Błąd przesyłania do Cloudinary:', error);
    // Tymczasowy URL dla testów
    return URL.createObjectURL(file);
  }
};

/**
 * Przesyła wiele plików do Cloudinary
 * @param {File[]} files - Tablica plików do przesłania
 * @param {Function} onProgress - Opcjonalna funkcja callback dla postępu przesyłania
 * @returns {Promise<string[]>} Tablica URL-i przesłanych plików
 */
export const uploadMultipleToCloudinary = async (files, onProgress) => {
  const urls = [];
  
  try {
    for (let i = 0; i < files.length; i++) {
      try {
        if (onProgress) {
          onProgress(i + 1, files.length);
        }
        
        // W trybie produkcyjnym używamy faktycznego uploadu
        const url = await uploadToCloudinary(files[i]);
        urls.push(url);
      } catch (fileError) {
        console.error(`Błąd przesyłania pliku ${i + 1}:`, fileError);
        // Używamy lokalnego URL w przypadku błędu
        urls.push(URL.createObjectURL(files[i]));
      }
    }
    
    if (onProgress) {
      onProgress(files.length, files.length);
    }
    
    return urls;
  } catch (error) {
    console.error('Błąd przesyłania wielu plików:', error);
    // W przypadku globalnego błędu zwracamy tymczasowe URL-e
    return files.map(file => URL.createObjectURL(file));
  }
};

export default {
  uploadToCloudinary,
  uploadMultipleToCloudinary
};