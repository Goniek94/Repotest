import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const PhotoModal = ({
  isOpen,
  photos = [],
  photoIndex = 0,
  onClose,
  prevPhoto,
  nextPhoto,
}) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Handle keyboard navigation
      const handleKeyPress = (e) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') prevPhoto();
        if (e.key === 'ArrowRight') nextPhoto();
      };
      
      document.addEventListener('keydown', handleKeyPress);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isOpen, onClose, prevPhoto, nextPhoto]);

  if (!isOpen) return null;

  const currentPhoto = photos[photoIndex] || '';

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && photos.length > 1) {
      nextPhoto();
    }
    if (isRightSwipe && photos.length > 1) {
      prevPhoto();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* Background overlay */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal content */}
      <div className="relative w-full h-full flex flex-col">
        {/* Header with close button and counter */}
        <div className="flex justify-between items-center p-4 text-white z-10">
          <div className="text-sm font-medium">
            Zdjęcie {photoIndex + 1} z {photos.length}
          </div>
          <button
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            onClick={onClose}
            title="Zamknij (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image container */}
        <div className="flex-1 flex items-center justify-center relative px-4 pb-4">
          {/* Navigation buttons - hidden on mobile, visible on desktop */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10 hidden sm:flex items-center justify-center"
                title="Poprzednie zdjęcie"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10 hidden sm:flex items-center justify-center"
                title="Następne zdjęcie"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image */}
          <img
            src={currentPhoto}
            alt={`Zdjęcie powiększone ${photoIndex + 1}`}
            className="max-w-full max-h-full object-contain select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            draggable={false}
          />
        </div>

        {/* Mobile navigation dots */}
        {photos.length > 1 && (
          <div className="flex justify-center space-x-2 pb-4 sm:hidden">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  // Update photo index to clicked dot
                  const diff = index - photoIndex;
                  if (diff > 0) {
                    for (let i = 0; i < diff; i++) nextPhoto();
                  } else if (diff < 0) {
                    for (let i = 0; i < Math.abs(diff); i++) prevPhoto();
                  }
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === photoIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Mobile swipe hint */}
        {photos.length > 1 && (
          <div className="text-center text-white/70 text-xs pb-2 sm:hidden">
            Przesuń palcem, aby przejść do następnego zdjęcia
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoModal;
