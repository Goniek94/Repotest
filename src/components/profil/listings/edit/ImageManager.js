import React, { useState } from 'react';
import { Upload, Trash2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import getImageUrl from '../../../../utils/responsive/getImageUrl';

/**
 * Komponent do zarządzania zdjęciami w edycji ogłoszenia
 * Pierwsze zdjęcie = zdjęcie główne, max 15 zdjęć, min 5 zdjęć
 */
const ImageManager = ({
  images,
  newImages,
  onImageChange,
  onRemoveImage,
  onDeleteImage,
  onMoveImage
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Funkcja do przesuwania zdjęcia w lewo
  const moveImageLeft = (index) => {
    if (index > 0 && onMoveImage) {
      onMoveImage(index, index - 1);
    }
  };

  // Funkcja do przesuwania zdjęcia w prawo
  const moveImageRight = (index) => {
    if (index < images.length - 1 && onMoveImage) {
      onMoveImage(index, index + 1);
    }
  };

  // Obsługa drag & drop
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex && onMoveImage) {
      onMoveImage(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  return (
    <div className="p-6 border-b border-gray-200 bg-gray-50/30">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
        <Upload className="w-5 h-5 mr-2 text-[#35530A]" /> Zdjęcia
      </h2>
      
      {/* Istniejące zdjęcia */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Zdjęcia</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.length === 0 ? (
            // Jeśli nie ma zdjęć, pokaż tylko kafelek "Dodaj zdjęcie"
            <button
              type="button"
              onClick={() => document.getElementById('file-upload').click()}
              className="relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-[#35530A]/50 hover:bg-[#35530A]/5 transition-all transform hover:-translate-y-1 duration-200"
            >
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 font-medium">Dodaj zdjęcie</span>
            </button>
          ) : (
            // Jeśli są zdjęcia, pokaż je wraz z kafelkiem "Dodaj zdjęcie" na końcu
            <>
              {images.map((image, index) => (
                <div 
                  key={index} 
                  draggable={onMoveImage ? true : false}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative rounded-lg overflow-hidden border-2 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 duration-200 ${
                    index === 0 
                      ? 'border-[#35530A] ring-2 ring-[#35530A]/30' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${draggedIndex === index ? 'opacity-50' : ''} ${onMoveImage ? 'cursor-move' : ''}`}
                >
                  <img 
                    src={getImageUrl(image)} 
                    alt={`Zdjęcie ${index + 1}`}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      console.error(`Błąd ładowania zdjęcia ${index}:`, image);
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.jpg";
                      toast.error(`Nie udało się załadować zdjęcia ${index + 1}. Spróbuj odświeżyć stronę.`);
                    }}
                  />
                  
                  {/* Ikona gwiazdki dla pierwszego zdjęcia (główne) */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-[#35530A] text-white rounded-full p-1.5 shadow-md">
                      <Star className="w-4 h-4" />
                    </div>
                  )}
                  
                  {/* Przyciski przesuwania */}
                  {onMoveImage && images.length > 1 && (
                    <>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            moveImageLeft(index);
                          }}
                          className="absolute bottom-2 left-2 bg-white/80 hover:bg-white text-[#35530A] rounded-full p-1 shadow-sm hover:shadow-md transition-all"
                          title="Przesuń w lewo"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}
                      
                      {index < images.length - 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            moveImageRight(index);
                          }}
                          className="absolute bottom-2 right-2 bg-white/80 hover:bg-white text-[#35530A] rounded-full p-1 shadow-sm hover:shadow-md transition-all"
                          title="Przesuń w prawo"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Przycisk usuwania */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteImage(index);
                    }}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-red-500 text-red-500 hover:text-white rounded-full p-1.5 shadow-sm hover:shadow-md transition-all"
                    title="Usuń zdjęcie"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {/* Kafelek "Dodaj zdjęcie" - widoczny tylko gdy jest mniej niż 15 zdjęć */}
              {images.length < 15 && (
                <button
                  type="button"
                  onClick={() => document.getElementById('file-upload').click()}
                  className="relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-[#35530A]/50 hover:bg-[#35530A]/5 transition-all transform hover:-translate-y-1 duration-200"
                >
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">Dodaj zdjęcie</span>
                </button>
              )}
            </>
          )}
        </div>
        
        <input 
          id="file-upload"
          type="file" 
          className="hidden" 
          accept="image/*" 
          multiple 
          onChange={onImageChange}
        />
        
        <p className="text-sm text-gray-500 mt-2">
          Możesz dodać maksymalnie {15 - images.length} nowych zdjęć (łącznie max. 15). 
          Minimum 5 zdjęć wymagane do zapisania. Maksymalny rozmiar pliku: 5MB.
          {images.length > 0 && <span className="block mt-1">Pierwsze zdjęcie jest zdjęciem głównym. Przeciągnij lub użyj strzałek do zmiany kolejności.</span>}
        </p>
      </div>
      
      {/* Podgląd nowych zdjęć */}
      {newImages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Nowe zdjęcia do dodania</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {newImages.map((file, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 duration-200">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Nowe zdjęcie ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveImage(index, true);
                  }}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-red-500 text-red-500 hover:text-white rounded-full p-1.5 shadow-sm hover:shadow-md transition-all"
                  title="Usuń zdjęcie"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManager;
