// PhotoUpload.js
import React, { useState } from 'react';
import { FaCloudUploadAlt as FaCloudUploadIcon } from 'react-icons/fa';
import { FaStar as FaStarIcon } from 'react-icons/fa';
import { FaTrash as FaTrashIcon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PhotoUpload = () => {
  const navigate = useNavigate();

  // Stany
  const maxPhotos = 20;
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [listingType, setListingType] = useState('standard');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [carConditionConfirmed, setCarConditionConfirmed] = useState(false);

  // Nowe stany
  const [price, setPrice] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [purchaseOption, setPurchaseOption] = useState('sprzedaz');

  // Handlery
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > maxPhotos) {
      alert(`Maksymalna liczba zdjęć to ${maxPhotos}`);
      return;
    }

    const newPhotos = [...photos];
    files.forEach(file => {
      newPhotos.push(URL.createObjectURL(file));
    });
    setPhotos(newPhotos);
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    if (index === mainPhotoIndex) {
      setMainPhotoIndex(0);
    }
    setPhotos(newPhotos);
  };

  const setMainPhoto = (index) => {
    setMainPhotoIndex(index);
  };

  const handleRemoveAll = () => {
    setPhotos([]);
    setMainPhotoIndex(0);
  };

  const handleSubmit = () => {
    if (!acceptedTerms || !carConditionConfirmed) {
      alert('Proszę zaakceptować wymagane zgody');
      return;
    }
    navigate('/payment', { 
      state: { 
        photos,
        description,
        price,
        rentalPrice,
        purchaseOption,
        listingType
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Sekcja zdjęć */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-6">Dodaj zdjęcia ogłoszenia (max {maxPhotos} zdjęć)</h3>

          {/* Wskazówki dotyczące zdjęć */}
          {/*
            Zamiast bg-green-50 itp. robimy jasne tło pasujące do #35530A.
            Można dać np. bg-[#F5FAF5] i border-l-[#35530A], text-[#35530A].
          */}
          <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] text-[#35530A] p-4 rounded-lg mb-6">
            <p className="text-sm">
              Zdjęcia powinny być zgodne z rzeczywistym stanem samochodu. Zaleca się, aby zawierały:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm">
              <li>Widok z przodu i z tyłu pojazdu.</li>
              <li>Zbliżenia na uszkodzenia, jeśli występują.</li>
              <li>Wnętrze pojazdu (kierownica, deska rozdzielcza, fotele).</li>
              <li>Zbliżenie na licznik kilometrów.</li>
              <li>Zbliżenie na opony, aby pokazać ich stan.</li>
            </ul>
          </div>

          {/* Obszar dodawania zdjęć */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
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
              <FaCloudUploadIcon className="text-6xl text-gray-400 mb-4" />
              <span className="text-gray-600 text-lg mb-2">Przeciągnij zdjęcia lub kliknij, aby dodać</span>
              {/*
                Zamiast bg-green-500 -> #35530A,
                hover:bg-green-600 -> np. hover:bg-[#2c4a09] (odcień ciemniejszy).
              */}
              <span className="px-6 py-3 bg-[#35530A] text-white rounded-lg hover:bg-[#2c4a09] transition-colors">
                Wybierz zdjęcia
              </span>
            </label>
            <div className="mt-4 text-sm text-gray-500">
              Maksymalny rozmiar: 5MB, formaty: JPG, PNG
            </div>
          </div>

          {/* Galeria zdjęć */}
          {photos.length > 0 && (
            <div className="grid grid-cols-5 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={photo}
                    alt={`Zdjęcie ${index + 1}`}
                    className={`w-full h-full object-cover rounded-lg cursor-pointer
                      ${index === mainPhotoIndex ? 'ring-2 ring-[#35530A]' : 'hover:opacity-75'}`}
                    onClick={() => setMainPhoto(index)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg">
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100"
                    >
                      <FaTrashIcon size={14} />
                    </button>
                    {index === mainPhotoIndex && (
                      <FaStarIcon className="absolute top-1 left-1 text-yellow-400" size={18} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {photos.length > 0 && (
            <button
              onClick={handleRemoveAll}
              className="mt-4 text-red-500 hover:text-red-600"
            >
              Usuń wszystkie zdjęcia
            </button>
          )}
        </div>

        {/* Sekcja opisu */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-6">Dodaj opis*</h3>

          {/* Wskazówki dotyczące opisu */}
          <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] text-[#35530A] p-4 rounded-lg mb-6">
            <p className="text-sm">
              W opisie powinny znaleźć się najważniejsze informacje o pojeździe:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm">
              <li>Stan techniczny pojazdu</li>
              <li>Historia serwisowa</li>
              <li>Wyposażenie dodatkowe</li>
              <li>Ostatnio wykonane naprawy</li>
              <li>Informacje o usterkach (jeśli występują)</li>
            </ul>
          </div>

          {/* Pole tekstowe do opisu */}
          <div>
            <textarea
              rows="6"
              maxLength="2000"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Wpisz opis pojazdu..."
              className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]"
            ></textarea>
            <div className="mt-2 text-sm text-gray-500 text-right">
              Maksymalna liczba znaków: 2000
            </div>
          </div>
        </div>

        {/* Sekcja ceny i opcji zakupu */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-6">Cena samochodu i opcje zakupu</h3>

          {/* Pole ceny (tylko jeśli nie jest 'najem') */}
          {purchaseOption !== 'najem' && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Cena (zł)*
              </label>
              <input
                type="number"
                id="price"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]"
                placeholder="Wpisz cenę samochodu"
              />
            </div>
          )}

          {/* Pole 'Cena najmu' (tylko jeśli wybrano 'najem') */}
          {purchaseOption === 'najem' && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rentalPrice">
                Cena najmu (zł/miesiąc)*
              </label>
              <input
                type="number"
                id="rentalPrice"
                min="0"
                value={rentalPrice}
                onChange={(e) => setRentalPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]"
                placeholder="Wpisz cenę najmu za miesiąc"
              />
            </div>
          )}

          {/* Opcje zakupu (radio) */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Opcje zakupu*
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="purchaseOption"
                  value="sprzedaz"
                  checked={purchaseOption === 'sprzedaz'}
                  onChange={(e) => setPurchaseOption(e.target.value)}
                  className="mr-2 accent-[#35530A]"
                />
                <span>Sprzedaż</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="purchaseOption"
                  value="cesja"
                  checked={purchaseOption === 'cesja'}
                  onChange={(e) => setPurchaseOption(e.target.value)}
                  className="mr-2 accent-[#35530A]"
                />
                <span>Cesja</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="purchaseOption"
                  value="zamiana"
                  checked={purchaseOption === 'zamiana'}
                  onChange={(e) => setPurchaseOption(e.target.value)}
                  className="mr-2 accent-[#35530A]"
                />
                <span>Zamiana</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="purchaseOption"
                  value="najem"
                  checked={purchaseOption === 'najem'}
                  onChange={(e) => setPurchaseOption(e.target.value)}
                  className="mr-2 accent-[#35530A]"
                />
                <span>Najem</span>
              </label>
            </div>
          </div>
        </div>

        {/* Typ ogłoszenia */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Wybierz rodzaj ogłoszenia</h3>
          <div className="flex gap-6 mb-6">
            <label className="flex-1 border p-4 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="listingType"
                value="standard"
                checked={listingType === 'standard'}
                onChange={(e) => setListingType(e.target.value)}
                className="mr-2 accent-[#35530A]"
              />
              <span className="font-medium">OGŁOSZENIE STANDARDOWE</span>
              <div className="text-center mt-2 text-[#35530A]">30 zł / 30 dni</div>
            </label>

            <label className="flex-1 border p-4 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="listingType"
                value="premium"
                checked={listingType === 'premium'}
                onChange={(e) => setListingType(e.target.value)}
                className="mr-2 accent-[#35530A]"
              />
              <span className="font-medium">OGŁOSZENIE WYRÓŻNIONE</span>
              <div className="text-center mt-2 text-[#35530A]">50 zł / 30 dni</div>
            </label>
          </div>

          {/* Zgody */}
          <div className="space-y-3">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 mr-2 accent-[#35530A]"
              />
              <span className="text-sm">
                Oświadczam, że zapoznałem(-am) się z Regulaminem serwisu i akceptuję jego postanowienia.
              </span>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                checked={carConditionConfirmed}
                onChange={(e) => setCarConditionConfirmed(e.target.checked)}
                className="mt-1 mr-2 accent-[#35530A]"
              />
              <span className="text-sm">
                Oświadczam, że stan samochodu jest zgodny z opisem i stanem faktycznym.
              </span>
            </label>
          </div>

          {/* Przycisk Dalej (płatność) */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={!acceptedTerms || !carConditionConfirmed}
              className={`px-6 py-2 rounded text-white
                ${
                  acceptedTerms && carConditionConfirmed
                    ? 'bg-[#35530A] hover:bg-[#2c4a09]'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              Dalej (przejście do płatności)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
