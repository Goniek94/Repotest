/**
 * Image Optimizer Utility
 * Kompresja i optymalizacja zdjęć przed uplodem
 */

/**
 * Kompresuje obraz do określonej szerokości maksymalnej
 * @param {File} file - Plik obrazu do kompresji
 * @param {number} maxWidth - Maksymalna szerokość (domyślnie 1920px)
 * @param {number} quality - Jakość kompresji (0.1 - 1.0, domyślnie 0.8)
 * @returns {Promise<File>} - Skompresowany plik
 */
export const compressImage = async (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // Sprawdź czy to jest obraz
    if (!file.type.startsWith('image/')) {
      reject(new Error('Plik nie jest obrazem'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Oblicz nowe wymiary zachowując proporcje
        const { width: newWidth, height: newHeight } = calculateDimensions(
          img.width, 
          img.height, 
          maxWidth
        );

        // Ustaw wymiary canvas
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Narysuj obraz na canvas z nową wielkością
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Konwertuj canvas do blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Nie udało się skompresować obrazu'));
              return;
            }

            // Utwórz nowy plik z skompresowanymi danymi
            const compressedFile = new File(
              [blob], 
              file.name, 
              {
                type: file.type,
                lastModified: Date.now()
              }
            );


            resolve(compressedFile);
          },
          file.type,
          quality
        );
      } catch (error) {
        reject(new Error(`Błąd podczas kompresji: ${error.message}`));
      }
    };

    img.onerror = () => {
      reject(new Error('Nie udało się załadować obrazu'));
    };

    // Załaduj obraz
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Oblicza nowe wymiary obrazu zachowując proporcje
 * @param {number} originalWidth - Oryginalna szerokość
 * @param {number} originalHeight - Oryginalna wysokość
 * @param {number} maxWidth - Maksymalna szerokość
 * @returns {Object} - Nowe wymiary {width, height}
 */
export const calculateDimensions = (originalWidth, originalHeight, maxWidth) => {
  if (originalWidth <= maxWidth) {
    return {
      width: originalWidth,
      height: originalHeight
    };
  }

  const ratio = originalHeight / originalWidth;
  return {
    width: maxWidth,
    height: Math.round(maxWidth * ratio)
  };
};

/**
 * Generuje thumbnail o określonych wymiarach
 * @param {File} file - Plik obrazu
 * @param {number} size - Rozmiar thumbnail (domyślnie 300px)
 * @returns {Promise<File>} - Plik thumbnail
 */
export const generateThumbnail = async (file, size = 300) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Plik nie jest obrazem'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Ustaw wymiary canvas na kwadrat
        canvas.width = size;
        canvas.height = size;

        // Oblicz wymiary do crop (wycentrowane)
        const minDimension = Math.min(img.width, img.height);
        const cropX = (img.width - minDimension) / 2;
        const cropY = (img.height - minDimension) / 2;

        // Narysuj obraz jako kwadrat (crop + resize)
        ctx.drawImage(
          img,
          cropX, cropY, minDimension, minDimension, // źródło (crop)
          0, 0, size, size // cel (resize)
        );

        // Konwertuj do blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Nie udało się wygenerować thumbnail'));
              return;
            }

            const thumbnailFile = new File(
              [blob],
              `thumb_${file.name}`,
              {
                type: file.type,
                lastModified: Date.now()
              }
            );


            resolve(thumbnailFile);
          },
          file.type,
          0.8 // Jakość dla thumbnail
        );
      } catch (error) {
        reject(new Error(`Błąd podczas generowania thumbnail: ${error.message}`));
      }
    };

    img.onerror = () => {
      reject(new Error('Nie udało się załadować obrazu dla thumbnail'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Waliduje plik obrazu
 * @param {File} file - Plik do walidacji
 * @param {Object} options - Opcje walidacji
 * @returns {Object} - Wynik walidacji {isValid, errors}
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    minWidth = 100,
    minHeight = 100
  } = options;

  const errors = [];

  // Sprawdź typ pliku
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Nieobsługiwany format pliku: ${file.type}. Dozwolone: ${allowedTypes.join(', ')}`);
  }

  // Sprawdź rozmiar pliku
  if (file.size > maxSize) {
    errors.push(`Plik jest za duży: ${formatFileSize(file.size)}. Maksymalny rozmiar: ${formatFileSize(maxSize)}`);
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
 * Pobiera metadane obrazu
 * @param {File} file - Plik obrazu
 * @returns {Promise<Object>} - Metadane obrazu
 */
export const getImageMetadata = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Plik nie jest obrazem'));
      return;
    }

    const img = new Image();

    img.onload = () => {
      const metadata = {
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type,
        lastModified: file.lastModified
      };

      resolve(metadata);
    };

    img.onerror = () => {
      reject(new Error('Nie udało się załadować obrazu dla metadanych'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Konwertuje obraz do formatu WebP (jeśli obsługiwany)
 * @param {File} file - Plik obrazu
 * @param {number} quality - Jakość (0.1 - 1.0)
 * @returns {Promise<File>} - Plik w formacie WebP lub oryginalny
 */
export const convertToWebP = async (file, quality = 0.8) => {
  // Sprawdź obsługę WebP
  if (!supportsWebP()) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const webpFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.webp'),
              {
                type: 'image/webp',
                lastModified: Date.now()
              }
            );

            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      } catch (error) {
        resolve(file);
      }
    };

    img.onerror = () => {
      resolve(file);
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Sprawdza obsługę formatu WebP
 * @returns {boolean} - Czy WebP jest obsługiwany
 */
export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * Formatuje rozmiar pliku
 * @param {number} bytes - Rozmiar w bajtach
 * @returns {string} - Sformatowany rozmiar
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Przetwarza wiele plików obrazów
 * @param {File[]} files - Tablica plików
 * @param {Object} options - Opcje przetwarzania
 * @param {Function} onProgress - Callback postępu
 * @returns {Promise<Object[]>} - Przetworzone pliki z metadanymi
 */
export const processImages = async (files, options = {}, onProgress = null) => {
  const {
    compress = true,
    generateThumbnails = true,
    convertWebP = false,
    maxWidth = 1920,
    quality = 0.8,
    thumbnailSize = 300
  } = options;

  const results = [];
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      // Walidacja
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Pobierz metadane
      const metadata = await getImageMetadata(file);

      let processedFile = file;
      let thumbnailFile = null;

      // Kompresja
      if (compress && metadata.width > maxWidth) {
        processedFile = await compressImage(file, maxWidth, quality);
      }

      // Konwersja do WebP
      if (convertWebP) {
        processedFile = await convertToWebP(processedFile, quality);
      }

      // Generowanie thumbnail
      if (generateThumbnails) {
        thumbnailFile = await generateThumbnail(processedFile, thumbnailSize);
      }

      results.push({
        original: file,
        processed: processedFile,
        thumbnail: thumbnailFile,
        metadata: {
          ...metadata,
          processedSize: processedFile.size,
          thumbnailSize: thumbnailFile?.size || 0
        }
      });

      // Callback postępu
      if (onProgress) {
        onProgress({
          current: i + 1,
          total,
          percentage: Math.round(((i + 1) / total) * 100),
          currentFile: file.name
        });
      }

    } catch (error) {
      console.error(`Błąd przetwarzania pliku ${file.name}:`, error);
      
      // Dodaj plik z błędem
      results.push({
        original: file,
        processed: null,
        thumbnail: null,
        error: error.message,
        metadata: null
      });

      if (onProgress) {
        onProgress({
          current: i + 1,
          total,
          percentage: Math.round(((i + 1) / total) * 100),
          currentFile: file.name,
          error: error.message
        });
      }
    }
  }

  return results;
};
