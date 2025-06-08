import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const PhotoModal = ({
  isOpen,
  photos = [],
  photoIndex = 0,
  onClose,
  prevPhoto,
  nextPhoto,
}) => {
  if (!isOpen) return null;

  const currentPhoto = photos[photoIndex] || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative text-center max-w-5xl w-full mx-4">
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          onClick={onClose}
          title="Zamknij (Esc)"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="flex justify-between items-center mt-10">
          <button
            onClick={prevPhoto}
            className="bg-white/90 p-2 hover:bg-white transition-colors rounded-[2px]"
            title="Poprzednie zdjęcie"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <img
            src={currentPhoto}
            alt={`Zdjęcie powiększone ${photoIndex + 1}`}
            className="max-h-[85vh] w-auto mx-4 rounded-[2px]"
          />
          <button
            onClick={nextPhoto}
            className="bg-white/90 p-2 hover:bg-white transition-colors rounded-[2px]"
            title="Następne zdjęcie"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
        <div className="text-white mt-4 text-sm">
          Zdjęcie {photoIndex + 1} z {photos.length}
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
