/**
 * Automatyczna kompresja zdjęć przed uploadem
 * Optymalizuje rozmiar i jakość zdjęć dla lepszej wydajności
 */

/**
 * Kompresuje pojedynczy plik obrazu
 * @param {File} file - Plik do kompresji
 * @param {Object} options - Opcje kompresji
 * @returns {Promise<File>} - Skompresowany plik
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    maxSizeKB = 5120, // 5MB
    outputFormat = 'jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    // Sprawdź czy plik jest obrazem
    if (!file.type.startsWith('image/')) {
      reject(new Error('Plik nie jest obrazem'));
      return;
    }

    // Sprawdź rozmiar pliku
    if (file.size > maxSizeKB * 1024) {
      console.warn(`Plik ${file.name} przekracza maksymalny rozmiar ${maxSizeKB}KB`);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Oblicz nowe wymiary zachowując proporcje
        let { width, height } = calculateDimensions(
          img.width, 
          img.height, 
          maxWidth, 
          maxHeight
        );

        // Ustaw wymiary canvas
        canvas.width = width;
        canvas.height = height;

        // Włącz wygładzanie dla lepszej jakości
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Narysuj obraz na canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Konwertuj do blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Błąd kompresji obrazu'));
              return;
            }

            // Utwórz nowy plik z skompresowanymi danymi
            const compressedFile = new File(
              [blob], 
              generateFileName(file.name, outputFormat),
              { 
                type: `image/${outputFormat}`,
                lastModified: Date.now()
              }
            );

            // Loguj informacje o kompresji
            const compressionRatio = ((file.size - compressedFile.size) / file.size * 100).toFixed(1);
            console.log(`Kompresja ${file.name}:`, {
              originalSize: formatFileSize(file.size),
              compressedSize: formatFileSize(compressedFile.size),
              compressionRatio: `${compressionRatio}%`,
              dimensions: `${width}x${height}`
            });

            resolve(compressedFile);
          },
          `image/${outputFormat}`,
          quality
        );
      } catch (error) {
        reject(new Error(`Błąd przetwarzania obrazu: ${error.message}`));
      }
    };

    img.onerror = () => {
      reject(new Error('Błąd ładowania obrazu'));
    };

    // Załaduj obraz
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Kompresuje wiele plików jednocześnie
 * @param {FileList|Array} files - Lista plików do kompresji
 * @param {Object} options - Opcje kompresji
 * @param {Function} onProgress - Callback dla postępu
 * @returns {Promise<Array>} - Tablica skompresowanych plików
 */
export const compressImages = async (files, options = {}, onProgress = null) => {
  const fileArray = Array.from(files);
  const compressedFiles = [];
  const errors = [];

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    
    try {
      // Wywołaj callback postępu
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: fileArray.length,
          fileName: file.name,
          status: 'compressing'
        });
      }

      const compressedFile = await compressImage(file, options);
      compressedFiles.push(compressedFile);

      // Callback sukcesu
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: fileArray.length,
          fileName: file.name,
          status: 'completed'
        });
      }

    } catch (error) {
      console.error(`Błąd kompresji ${file.name}:`, error);
      errors.push({ file: file.name, error: error.message });
      
      // Callback błędu
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: fileArray.length,
          fileName: file.name,
          status: 'error',
          error: error.message
        });
      }
    }
  }

  return {
    compressedFiles,
    errors,
    totalOriginalSize: fileArray.reduce((sum, file) => sum + file.size, 0),
    totalCompressedSize: compressedFiles.reduce((sum, file) => sum + file.size, 0)
  };
};

/**
 * Oblicza nowe wymiary obrazu zachowując proporcje
 * @param {number} originalWidth - Oryginalna szerokość
 * @param {number} originalHeight - Oryginalna wysokość
 * @param {number} maxWidth - Maksymalna szerokość
 * @param {number} maxHeight - Maksymalna wysokość
 * @returns {Object} - Nowe wymiary
 */
const calculateDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
  let width = originalWidth;
  let height = originalHeight;

  // Sprawdź czy obraz wymaga przeskalowania
  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;

    if (width > height) {
      // Obraz poziomy
      width = maxWidth;
      height = width / aspectRatio;
      
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
    } else {
      // Obraz pionowy
      height = maxHeight;
      width = height * aspectRatio;
      
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
    }
  }

  return {
    width: Math.round(width),
    height: Math.round(height)
  };
};

/**
 * Generuje nazwę pliku z nowym rozszerzeniem
 * @param {string} originalName - Oryginalna nazwa pliku
 * @param {string} format - Nowy format (jpeg, png, webp)
 * @returns {string} - Nowa nazwa pliku
 */
const generateFileName = (originalName, format) => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const extension = format === 'jpeg' ? 'jpg' : format;
  return `${nameWithoutExt}_compressed.${extension}`;
};

/**
 * Formatuje rozmiar pliku do czytelnej postaci
 * @param {number} bytes - Rozmiar w bajtach
 * @returns {string} - Sformatowany rozmiar
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Waliduje plik obrazu przed kompresją
 * @param {File} file - Plik do walidacji
 * @param {Object} options - Opcje walidacji
 * @returns {Object} - Wynik walidacji
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSizeKB = 5120, // 5MB
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    minWidth = 100,
    minHeight = 100
  } = options;

  const errors = [];

  // Sprawdź typ pliku
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Nieobsługiwany format pliku: ${file.type}`);
  }

  // Sprawdź rozmiar pliku
  if (file.size > maxSizeKB * 1024) {
    errors.push(`Plik jest za duży: ${formatFileSize(file.size)} (max: ${formatFileSize(maxSizeKB * 1024)})`);
  }

  // Sprawdź czy plik nie jest pusty
  if (file.size === 0) {
    errors.push('Plik jest pusty');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Tworzy podgląd obrazu (thumbnail)
 * @param {File} file - Plik obrazu
 * @param {Object} options - Opcje thumbnail
 * @returns {Promise<string>} - Data URL thumbnail
 */
export const createThumbnail = async (file, options = {}) => {
  const {
    width = 150,
    height = 150,
    quality = 0.7
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;

      // Oblicz pozycję dla wycentrowania obrazu
      const scale = Math.max(width / img.width, height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (width - scaledWidth) / 2;
      const y = (height - scaledHeight) / 2;

      // Narysuj obraz
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      // Konwertuj do data URL
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };

    img.onerror = () => {
      reject(new Error('Błąd tworzenia thumbnail'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Sprawdza czy przeglądarka obsługuje kompresję obrazów
 * @returns {boolean} - Czy kompresja jest obsługiwana
 */
export const isCompressionSupported = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d') && canvas.toBlob);
  } catch (error) {
    return false;
  }
};

/**
 * Domyślne opcje kompresji dla różnych przypadków użycia
 */
export const COMPRESSION_PRESETS = {
  // Wysoka jakość dla zdjęć głównych
  HIGH_QUALITY: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.9,
    maxSizeKB: 5120,
    outputFormat: 'jpeg'
  },
  
  // Średnia jakość dla galerii
  MEDIUM_QUALITY: {
    maxWidth: 1280,
    maxHeight: 720,
    quality: 0.8,
    maxSizeKB: 3072,
    outputFormat: 'jpeg'
  },
  
  // Niska jakość dla thumbnail
  LOW_QUALITY: {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.7,
    maxSizeKB: 1024,
    outputFormat: 'jpeg'
  },
  
  // Dla zdjęć mobilnych
  MOBILE: {
    maxWidth: 1024,
    maxHeight: 768,
    quality: 0.75,
    maxSizeKB: 2048,
    outputFormat: 'jpeg'
  }
};
