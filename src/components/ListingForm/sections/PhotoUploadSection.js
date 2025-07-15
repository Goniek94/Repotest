import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Star, Trash2, Image, AlertCircle, CheckCircle, Cloud, Loader } from 'lucide-react';
import { compressImages, validateImageFile, COMPRESSION_PRESETS } from '../../../utils/imageCompression';
import { useImageUpload } from '../../../hooks/useImageUpload';

const PhotoUploadSection = ({ formData, setFormData, errors, showToast }) => {
  const [photos, setPhotos] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({ current: 0, total: 0, fileName: '' });
  const fileInputRef = useRef(null);

  // Synchronizacja zdjęć z globalnym stanem formularza
  useEffect(() => {
    // Konwersja zdjęć do formatu odpowiedniego dla API
    if (photos.length > 0) {
      const images = photos.map(photo => ({
        url: photo.src,
        file: photo.file || null,
        name: photo.name,
        originalName: photo.name,
        fileSize: photo.size || 0
      }));
      
      const mainImage = photos[mainPhotoIndex]?.src || '';
      
      // Aktualizacja globalnego stanu formularza
      setFormData(prev => ({
        ...prev,
        photos: photos,
        mainPhotoIndex: mainPhotoIndex,
        images: images,
        mainImage: mainImage
      }));
      
    } else {
      // Wyczyść dane gdy nie ma zdjęć
      setFormData(prev => ({
        ...prev,
        photos: [],
        mainPhotoIndex: 0,
        images: [],
        mainImage: ''
      }));
    }
  }, [photos, mainPhotoIndex, setFormData]);

  const handleFileUpload = useCallback(async (event) => {
    const files = Array.from(event.target.files);
    const remainingSlots = 15 - photos.length; // Zmieniono limit na 15
    
    if (files.length > remainingSlots) {
      alert(`Możesz dodać maksymalnie ${remainingSlots} zdjęć. Limit to 15 zdjęć.`);
      return;
    }

    // Walidacja plików przed kompresją
    const validFiles = [];
    for (const file of files) {
      const validation = validateImageFile(file, { maxSizeKB: 5120 });
      if (!validation.isValid) {
        alert(`Błąd w pliku ${file.name}: ${validation.errors.join(', ')}`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Rozpocznij kompresję
    setIsCompressing(true);
    setCompressionProgress({ current: 0, total: validFiles.length, fileName: '' });

    try {
      // Kompresja zdjęć z callbackiem postępu
      const result = await compressImages(
        validFiles, 
        COMPRESSION_PRESETS.HIGH_QUALITY,
        (progress) => {
          setCompressionProgress({
            current: progress.current,
            total: progress.total,
            fileName: progress.fileName,
            status: progress.status
          });
        }
      );

      // Przetwórz skompresowane pliki
      const newPhotos = [];
      for (const compressedFile of result.compressedFiles) {
        const reader = new FileReader();
        const photoPromise = new Promise((resolve) => {
          reader.onload = (e) => {
            const newPhoto = {
              id: Date.now() + Math.random(),
              src: e.target.result, // base64 do podglądu
              name: compressedFile.name,
              size: compressedFile.size,
              file: compressedFile // Skompresowany plik
            };
            resolve(newPhoto);
          };
        });
        reader.readAsDataURL(compressedFile);
        newPhotos.push(await photoPromise);
      }

      // Dodaj nowe zdjęcia do stanu
      setPhotos(prev => [...prev, ...newPhotos]);

      // Pokaż informacje o kompresji
      if (result.errors.length > 0) {
        console.warn('Błędy kompresji:', result.errors);
        alert(`Niektóre zdjęcia nie zostały skompresowane: ${result.errors.map(e => e.file).join(', ')}`);
      }

      // Wyczyść input
      event.target.value = '';

    } catch (error) {
      console.error('Błąd kompresji zdjęć:', error);
      alert('Wystąpił błąd podczas przetwarzania zdjęć. Spróbuj ponownie.');
    } finally {
      setIsCompressing(false);
      setCompressionProgress({ current: 0, total: 0, fileName: '' });
    }
  }, [photos.length]);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    
    const newPhotos = [...photos];
    const draggedPhoto = newPhotos[draggedIndex];
    
    newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(dropIndex, 0, draggedPhoto);
    
    setPhotos(newPhotos);
    setDraggedIndex(null);
    
    // Aktualizuj indeks głównego zdjęcia
    if (mainPhotoIndex === draggedIndex) {
      setMainPhotoIndex(dropIndex);
    } else if (draggedIndex < mainPhotoIndex && dropIndex >= mainPhotoIndex) {
      setMainPhotoIndex(mainPhotoIndex - 1);
    } else if (draggedIndex > mainPhotoIndex && dropIndex <= mainPhotoIndex) {
      setMainPhotoIndex(mainPhotoIndex + 1);
    }
  };

  const removePhoto = (indexToRemove) => {
    setPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
    
    if (mainPhotoIndex === indexToRemove) {
      setMainPhotoIndex(0);
    } else if (mainPhotoIndex > indexToRemove) {
      setMainPhotoIndex(mainPhotoIndex - 1);
    }
  };

  const clearAllPhotos = () => {
    setPhotos([]);
    setMainPhotoIndex(0);
  };

  const setAsMainPhoto = (index, event) => {
    // Zatrzymaj propagację zdarzenia, aby zapobiec nawigacji
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setMainPhotoIndex(index);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Obliczanie postępu
  const progress = photos.length > 0 ? 100 : 0;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white">
      
      {/* Jedna główna karta - kompaktowa */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header karty z postępem */}
        <div className="bg-gradient-to-r from-[#35530A] to-[#2D4A06] text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-bold">Zdjęcia pojazdu</h2>
                <p className="text-green-100 text-sm">Dodaj i uporządkuj zdjęcia</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{photos.length}</div>
              <div className="text-green-100 text-sm">z 15 zdjęć</div>
            </div>
          </div>
          
          {/* Pasek postępu */}
          <div className="mt-3 bg-green-900/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((photos.length / 15) * 100, 100)}%` }}
            />
          </div>
        </div>

      {/* Zawartość karty */}
      <div className="p-6 space-y-6">
          
          {/* Ostrzeżenie o tymczasowości */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Uwaga - zdjęcia tymczasowe!</p>
                <p>Zdjęcia zostaną przesłane po zapisaniu ogłoszenia. Po odświeżeniu strony zdjęcia znikną.</p>
              </div>
            </div>
          </div>

          {/* Upload Zone */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Upload className="h-5 w-5 text-[#35530A]" />
              <h3 className="text-lg font-semibold text-gray-800">Dodaj zdjęcia</h3>
            </div>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:border-[#35530A] hover:bg-green-50 transition-all duration-200 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Przeciągnij zdjęcia lub kliknij, aby wybrać
              </p>
              <p className="text-sm text-gray-500">
                Maksymalnie 15 zdjęć, każde do 5MB (automatyczna kompresja)
              </p>
              <div className="mt-3 text-sm text-gray-400">
                {photos.length}/15 zdjęć
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isCompressing}
            />
          </div>

          {/* Postęp kompresji */}
          {isCompressing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Loader className="h-5 w-5 text-blue-600 animate-spin" />
                <div>
                  <p className="font-medium text-blue-800">Kompresja zdjęć w toku...</p>
                  <p className="text-sm text-blue-600">
                    {compressionProgress.current} z {compressionProgress.total} zdjęć
                  </p>
                </div>
              </div>
              
              {/* Pasek postępu kompresji */}
              <div className="bg-blue-200 rounded-full h-2 overflow-hidden mb-2">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${compressionProgress.total > 0 ? (compressionProgress.current / compressionProgress.total) * 100 : 0}%` 
                  }}
                />
              </div>
              
              {compressionProgress.fileName && (
                <p className="text-xs text-blue-600 truncate">
                  Przetwarzanie: {compressionProgress.fileName}
                </p>
              )}
            </div>
          )}

          {/* Kontrolki */}
          {photos.length > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Dodano {photos.length} zdjęć
                </span>
                {photos.length > 0 && (
                  <span className="text-sm text-[#35530A] bg-green-50 border border-[#35530A] px-2 py-1 rounded-full">
                    Główne: {photos[mainPhotoIndex]?.name || 'Brak'}
                  </span>
                )}
              </div>
              
              <button
                onClick={clearAllPhotos}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm"
              >
                <Trash2 className="h-4 w-4" />
                Usuń wszystkie
              </button>
            </div>
          )}

          {/* Main Photo Display */}
          {photos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-[#35530A]" />
                <h3 className="text-lg font-semibold text-gray-800">Główne zdjęcie</h3>
              </div>
              
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={photos[mainPhotoIndex]?.src}
                  alt={photos[mainPhotoIndex]?.name}
                  className="w-full h-64 object-cover"
                />
                <div className="bg-black/80 p-3">
                  <div className="flex items-center gap-2 text-white">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{photos[mainPhotoIndex]?.name}</span>
                    <span className="text-sm opacity-75">
                      ({formatFileSize(photos[mainPhotoIndex]?.size)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Photo Grid */}
          {photos.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image className="h-5 w-5 text-[#35530A]" />
                <h3 className="text-lg font-semibold text-gray-800">Wszystkie zdjęcia</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`relative group cursor-move border rounded-lg p-2 bg-white transition-all duration-200 ${
                      index === mainPhotoIndex 
                        ? 'border-[#35530A] bg-green-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    } ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="rounded-md overflow-hidden">
                      <img
                        src={photo.src}
                        alt={photo.name}
                        className="w-full h-20 object-cover"
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-2 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center rounded-md">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => setAsMainPhoto(index, e)}
                          className="bg-[#35530A] hover:bg-[#2D4A06] text-white p-1 rounded-full transition-colors duration-200"
                          title="Ustaw jako główne"
                        >
                          <Star className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removePhoto(index)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors duration-200"
                          title="Usuń zdjęcie"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Main Photo Badge */}
                    {index === mainPhotoIndex && (
                      <div className="absolute top-3 left-3 bg-[#35530A] text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Główne
                      </div>
                    )}

                    {/* Photo Info */}
                    <div className="mt-2 px-1">
                      <p className="text-xs font-medium text-gray-700 truncate">
                        {photo.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(photo.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Image className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg text-gray-500 mb-2">Brak zdjęć</p>
              <p className="text-gray-400">Dodaj swoje pierwsze zdjęcie pojazdu</p>
            </div>
          )}

          {/* Status informacje */}
          {photos.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">Zdjęcia gotowe do zapisania!</p>
                  <p>Dodano {photos.length} zdjęć. Główne zdjęcie: {photos[mainPhotoIndex]?.name}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PhotoUploadSection;
