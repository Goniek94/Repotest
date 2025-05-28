import { useState, useEffect } from 'react';

export default function usePhotoUpload(photos = [], maxPhotos = 20) {
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    // Czyszczenie poprzednich URL-i podglądu
    previewUrls.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });

    // Tworzenie nowych URL-i podglądu
    const urls = photos.map(photo => {
      if (photo instanceof File) {
        return URL.createObjectURL(photo);
      }
      return photo;
    });

    setPreviewUrls(urls);

    // Czyszczenie URL-i podglądu przy odmontowywaniu komponentu
    return () => {
      urls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
    // eslint-disable-next-line
  }, [photos]);

  return {
    previewUrls,
    maxPhotos
  };
}
