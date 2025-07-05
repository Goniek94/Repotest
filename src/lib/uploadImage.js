import { API_URL, getAuthToken } from '../services/api/config';

export const uploadCarImages = async (files, carId, mainImageFile, onProgress) => {
  // Sprawdzamy, czy mamy pliki do przesłania
  if (!files || files.length === 0) {
    return [];
  }

  // Ensure mainImageFile is always uploaded first if it exists
  const sortedFiles = [...files].sort((a, b) => {
    if (a === mainImageFile) return -1;
    if (b === mainImageFile) return 1;
    return 0;
  });


  try {
    // Przygotowujemy FormData
    const formData = new FormData();
    
    // Dodajemy carId
    formData.append('carId', carId);
    
    // Znajdź indeks głównego zdjęcia
    const mainImageIndex = mainImageFile ? sortedFiles.indexOf(mainImageFile) : 0;
    formData.append('mainImageIndex', mainImageIndex.toString());
    
    // Dodajemy wszystkie pliki
    sortedFiles.forEach((file, index) => {
      formData.append('images', file);
    });

    // Pobieramy token autoryzacyjny
    const token = getAuthToken();
    
    // Przygotowujemy headers
    const headers = {
      // Nie ustawiamy Content-Type - przeglądarka ustawi automatycznie z boundary dla FormData
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Wysyłamy request z obsługą postępu
    const response = await fetch(`${API_URL}/api/images/upload`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include' // Dla cookies
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Upload failed');
    }

    // Aktualizujemy postęp na 100%
    if (onProgress) {
      onProgress(100);
    }

    
    // Zwracamy dane w formacie zgodnym z poprzednią implementacją
    return result.data.map(item => ({
      url: item.url,
      thumbnailUrl: item.thumbnailUrl,
      originalName: item.metadata?.originalName || 'Unknown',
      isMain: item.isMain || false,
      id: item.id
    }));

  } catch (error) {
    console.error('Błąd podczas przesyłania zdjęć przez API:', error);
    throw error; // Rzucamy błąd dalej, aby hook mógł go obsłużyć
  }
};

export const deleteCarImages = async (imageUrls) => {
  try {
    // Pobieramy token autoryzacyjny
    const token = getAuthToken();
    
    // Przygotowujemy headers
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Wysyłamy request do API
    const response = await fetch(`${API_URL}/api/images/delete`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ imageUrls }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Delete failed');
    }

    return result;

  } catch (error) {
    console.error('Błąd podczas usuwania zdjęć przez API:', error);
    throw error;
  }
};
