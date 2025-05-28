import React from 'react';
import { FaCloudUploadAlt, FaStar, FaTrash } from 'react-icons/fa';
import FileUploader from '../components/FileUploader';
import usePhotoUpload from '../hooks/usePhotoUpload';

const PhotoUploadSection = ({ formData, setFormData, errors, showToast }) => {
  const maxPhotos = 20;
  const { previewUrls } = usePhotoUpload(formData.photos, maxPhotos);

  // Obsługa uploadu zdjęć
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.photos.length + files.length > maxPhotos) {
      showToast(`Maksymalna liczba zdjęć to ${maxPhotos}`, 'error');
      return;
    }
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  // Usuwanie zdjęcia
  const removePhoto = (index) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    let mainIndex = formData.mainPhotoIndex;
    if (index === mainIndex) {
      mainIndex = 0;
    } else if (index < mainIndex) {
      mainIndex--;
    }
    setFormData(prev => ({
      ...prev,
      photos: newPhotos,
      mainPhotoIndex: mainIndex
    }));
  };

  // Ustawienie głównego zdjęcia
  const setMainPhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      mainPhotoIndex: index
    }));
  };

  // Usunięcie wszystkich zdjęć
  const removeAllPhotos = () => {
    setFormData(prev => ({
      ...prev,
      photos: [],
      mainPhotoIndex: 0
    }));
  };

  return (
    <div className="bg-white p-6 rounded-[2px] shadow-md">
      <div>
        <h3 className="text-white p-2 rounded-[2px] mb-4 bg-[#35530A]">
          Dodaj zdjęcia ogłoszenia (max {maxPhotos} zdjęć)
        </h3>
        <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] text-[#35530A] p-4 rounded-[2px] mb-6">
          <p className="text-sm font-medium mb-2">
            Wyższa jakość zdjęć = więcej zainteresowanych kupujących!
          </p>
          <p className="text-sm">
            Zdjęcia powinny być zgodne z rzeczywistym stanem samochodu. Upewnij się, że dodajesz:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2 text-sm">
            <div className="flex items-start">
              <span className="inline-block w-4 h-4 bg-[#35530A] text-white text-xs rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 mr-1.5">✓</span>
              <span>Widok z zewnątrz - przód, tył, bok</span>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-4 h-4 bg-[#35530A] text-white text-xs rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 mr-1.5">✓</span>
              <span>Wnętrze pojazdu</span>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-4 h-4 bg-[#35530A] text-white text-xs rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 mr-1.5">✓</span>
              <span>Licznik kilometrów</span>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-4 h-4 bg-[#35530A] text-white text-xs rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 mr-1.5">✓</span>
              <span>Ewentualne uszkodzenia i wady</span>
            </div>
          </div>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-[2px] p-8 text-center mb-6 hover:border-[#35530A] transition-colors">
          <input
            type="file"
            id="photo-upload"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <label
            htmlFor="photo-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <FaCloudUploadAlt className="text-5xl text-gray-400 mb-4" />
            <span className="text-gray-600 text-lg mb-3">
              Przeciągnij zdjęcia lub kliknij aby dodać
            </span>
            <span className="px-6 py-3 bg-[#35530A] text-white rounded-[2px] hover:bg-[#2c4a09] transition-colors">
              Wybierz zdjęcia
            </span>
          </label>
          <div className="mt-4 text-sm text-gray-500">
            Maksymalny rozmiar: 5MB, formaty: JPG, PNG, WEBP
          </div>
        </div>
        {errors.photos && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 mb-4">
            <p>{errors.photos}</p>
          </div>
        )}
        {previewUrls.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Wybierz zdjęcie główne (oznaczone gwiazdką)</h4>
            <p className="text-sm text-gray-600 mb-4">
              Kliknij na zdjęcie, aby ustawić je jako główne. Zdjęcie główne będzie wyświetlane jako pierwsze w ogłoszeniu.
            </p>
          </div>
        )}
        {previewUrls.length > 0 && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className={`aspect-square overflow-hidden rounded-[2px] ${index === formData.mainPhotoIndex ? 'ring-2 ring-[#35530A]' : ''}`}>
                    <img
                      src={url}
                      alt={`Zdjęcie ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                      onClick={() => setMainPhoto(index)}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all">
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                      type="button"
                      title="Usuń zdjęcie"
                    >
                      <FaTrash size={14} />
                    </button>
                    <button
                      onClick={() => setMainPhoto(index)}
                      className={`absolute bottom-2 left-2 p-1.5 rounded-[2px] transition-opacity
                        ${index === formData.mainPhotoIndex 
                          ? 'bg-[#35530A] text-white opacity-100' 
                          : 'bg-white text-gray-800 opacity-0 group-hover:opacity-100'}`}
                      type="button"
                      title="Ustaw jako główne"
                    >
                      <FaStar size={14} className={index === formData.mainPhotoIndex ? 'text-yellow-400' : ''} />
                    </button>
                  </div>
                  {index === formData.mainPhotoIndex && (
                    <div className="absolute top-2 left-2 bg-[#35530A] text-white text-xs px-2 py-1 rounded-[2px]">
                      Główne
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Dodanych zdjęć: <span className="font-medium">{formData.photos.length}</span> z {maxPhotos}
              </div>
              <button
                onClick={removeAllPhotos}
                className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                type="button"
              >
                <FaTrash size={12} />
                Usuń wszystkie zdjęcia
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUploadSection;
