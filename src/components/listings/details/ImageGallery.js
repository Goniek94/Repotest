import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import getImageUrl from '../../../utils/responsive/getImageUrl';
import PhotoModal from '../../ui/PhotoModal';

const ImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Jeśli nie ma zdjęć, wyświetl placeholder
  const displayImages = images && images.length > 0 
    ? images 
    : ['/images/auto-788747_1280.jpg'];

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  const openPhotoModal = (index) => {
    setPhotoIndex(index);
    setIsPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setIsPhotoModalOpen(false);
  };

  const nextPhoto = () => {
    setPhotoIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  const prevPhoto = () => {
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-sm">
      <div className="relative aspect-video mb-4">
        <img
          src={getImageUrl(displayImages[selectedImage])}
          alt={`Zdjęcie ${selectedImage + 1}`}
          className="w-full h-full object-cover rounded-sm cursor-pointer"
          onClick={() => openPhotoModal(selectedImage)}
        />
        <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevImage();
            }}
            className="bg-white/80 p-2 hover:bg-white transition-colors rounded-sm"
            title="Poprzednie"
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
            className="bg-white/80 p-2 hover:bg-white transition-colors rounded-sm"
            title="Następne"
          >
            <ChevronRight className="w-6 h-6 text-black" />
          </button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-sm text-sm">
          {selectedImage + 1} / {displayImages.length}
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {displayImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-video overflow-hidden rounded-sm ${
              selectedImage === index ? 'ring-2 ring-[#35530A]' : ''
            }`}
          >
            <img
              src={getImageUrl(img)}
              alt={`Miniatura ${index + 1}`}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
            />
          </button>
        ))}
      </div>

      {/* Modal ze zdjęciami */}
      <PhotoModal
        isOpen={isPhotoModalOpen}
        photos={displayImages.map(img => getImageUrl(img))}
        photoIndex={photoIndex}
        onClose={closePhotoModal}
        prevPhoto={prevPhoto}
        nextPhoto={nextPhoto}
      />
    </div>
  );
};

export default ImageGallery;
