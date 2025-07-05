import { useState } from 'react'
import { uploadCarImages } from '../lib/uploadImage'

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadImages = async (files, carId, mainImageFile) => {
    if (!files || files.length === 0) {
      return [];
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Przygotuj pliki do przesłania - tylko te, które są obiektami File
      const filesToUpload = files.filter(file => file && file instanceof File);
      
      if (filesToUpload.length === 0) {
        // Jeśli nie ma plików do przesłania, ale są jakieś obiekty z URL-ami, zwracamy je
        const existingUrls = files
          .filter(file => file && (typeof file === 'string' || file.url))
          .map(file => {
            if (typeof file === 'string') {
              return { url: file, isMain: false };
            } else {
              return { url: file.url, isMain: file === mainImageFile };
            }
          });
        
        if (existingUrls.length > 0) {
          return existingUrls;
        }
        
        return [];
      }
      
      // Dodajemy obsługę błędów dla każdego pliku
      for (const file of filesToUpload) {
        if (!file.type.startsWith('image/')) {
          setError(`Plik ${file.name} nie jest obrazem. Dozwolone są tylko pliki graficzne.`);
          setIsUploading(false);
          return [];
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB
          setError(`Plik ${file.name} jest za duży (${(file.size / 1024 / 1024).toFixed(2)}MB). Maksymalny rozmiar to 10MB.`);
          setIsUploading(false);
          return [];
        }
      }
      
      // Pass mainImageFile to the upload function
      const imageUrls = await uploadCarImages(filesToUpload, carId, mainImageFile, (progress) => {
        setUploadProgress(progress);
      });
      
      // Sprawdzamy, czy otrzymaliśmy jakieś URL-e
      if (!imageUrls || imageUrls.length === 0) {
        setError('Nie udało się przesłać zdjęć. Spróbuj ponownie później.');
        return [];
      }
      
      setUploadProgress(100);
      return imageUrls;
    } catch (error) {
      console.error('Błąd podczas przesyłania zdjęć:', error);
      setError(`Błąd podczas przesyłania zdjęć: ${error.message || 'Nieznany błąd'}`);
      
      // Zwracamy pustą tablicę zamiast rzucać wyjątek
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImages,
    isUploading,
    uploadProgress,
    error,
    clearError: () => setError(null)
  };
};
