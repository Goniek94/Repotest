// src/components/listings/details/ImageGallery.js
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ImageGallery = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X size={32} />
      </button>
      <button
        onClick={previousImage}
        className="absolute left-4 text-white hover:text-gray-300"
      >
        <ChevronLeft size={32} />
      </button>
      <img
        src={images[currentImage]}
        alt={`Zdjęcie ${currentImage + 1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain"
      />
      <button
        onClick={nextImage}
        className="absolute right-4 text-white hover:text-gray-300"
      >
        <ChevronRight size={32} />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
        {currentImage + 1} / {images.length}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Główne zdjęcie */}
      <div className="relative">
        <img
          src={images[currentImage]}
          alt={`Zdjęcie ${currentImage + 1}`}
          className="w-full h-[500px] object-cover rounded-lg cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
        <button
          onClick={previousImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
        >
          <ChevronRight size={24} />
        </button>
        <div className="absolute bottom-4 right-4 bg-black/50 px-4 py-2 rounded-full text-white">
          {currentImage + 1} / {images.length}
        </div>
      </div>

      {/* Miniatury */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`flex-none ${
              index === currentImage ? 'ring-2 ring-green-600' : ''
            }`}
          >
            <img
              src={image}
              alt={`Miniatura ${index + 1}`}
              className="w-24 h-24 object-cover rounded-lg"
            />
          </button>
        ))}
      </div>

      {/* Modal z powiększonym zdjęciem */}
      {isModalOpen && <Modal />}
    </div>
  );
};

export default ImageGallery;
