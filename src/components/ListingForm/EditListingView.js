// src/components/ListingForm/EditListingView.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Upload, X, Plus } from 'lucide-react';
import AdsService from '../../services/ads';
import apiClient from '../../services/api/client';
import debugUtils from '../../utils/debug';

const { safeConsole } = debugUtils;
import PaymentModal from '../payment/PaymentModal';

const EditListingView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  // Stany
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [editableFields, setEditableFields] = useState({
    description: '',
    price: '',
    city: '',
    voivodeship: '',
    color: '',
    mainImageIndex: 0
  });
  
  // Uproszczona funkcja odświeżania danych
  const refreshListing = useCallback(async () => {
    try {
      const response = await AdsService.getById(id);
      const data = response.data || response;
      
      setListing(data);
      setSelectedImage(0); // Pierwsze zdjęcie jest zawsze główne
      
      // Ustawienie edytowalnych pól
      setEditableFields({
        description: data.description || '',
        price: data.price || '',
        city: data.city || '',
        voivodeship: data.voivodeship || '',
        color: data.color || '',
        condition: data.condition || '',
        headline: data.headline || ''
      });
      
      return data;
    } catch (err) {
      safeConsole.error('❌ Błąd podczas odświeżania:', err);
      throw err;
    }
  }, [id]);

  // Pobieranie danych ogłoszenia
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        await refreshListing();
      } catch (err) {
        safeConsole.error('Błąd podczas pobierania ogłoszenia:', err);
        setError('Nie udało się pobrać ogłoszenia. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchListing();
    }
  }, [id, refreshListing]);

  // Obsługa zmiany głównego zdjęcia
  const handleSetMainImage = async (index) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      // Aktualizacja lokalnego stanu
      setSelectedImage(index);
      
      // Aktualizacja na serwerze
      await AdsService.setMainImage(id, index);
      
      // Aktualizacja stanu ogłoszenia
      setListing(prev => ({
        ...prev,
        mainImageIndex: index
      }));
      
      setEditableFields(prev => ({
        ...prev,
        mainImageIndex: index
      }));
      
      setSuccess('Główne zdjęcie zostało zaktualizowane');
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      safeConsole.error('Błąd podczas ustawiania głównego zdjęcia:', err);
      setError('Nie udało się zaktualizować głównego zdjęcia. Spróbuj ponownie później.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obsługa usuwania zdjęcia
  const handleDeleteImage = async (index) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to zdjęcie?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      // Usuń zdjęcie z serwera
      await AdsService.deleteImage(id, index);
      
      // Odświeżenie danych ogłoszenia
      const response = await AdsService.getById(id);
      if (response.data) {
        setListing(response.data);
        
        // Jeśli usunięte zdjęcie było głównym, ustaw nowe główne
        if (selectedImage === index) {
          setSelectedImage(0);
        } else if (selectedImage > index) {
          setSelectedImage(selectedImage - 1);
        }
      }
      
      setSuccess('Zdjęcie zostało usunięte');
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      safeConsole.error('Błąd podczas usuwania zdjęcia:', err);
      setError('Nie udało się usunąć zdjęcia. Spróbuj ponownie później.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Obsługa dodawania nowych zdjęć
  const handleAddImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Sprawdzenie limitu zdjęć
    const currentImagesCount = listing.images ? listing.images.length : 0;
    const newImagesCount = currentImagesCount + files.length;
    
    if (newImagesCount > 20) {
      setError(`Możesz dodać maksymalnie 20 zdjęć. Obecnie masz ${currentImagesCount}, próbujesz dodać ${files.length}.`);
      return;
    }
    
    try {
      setUploadingImages(true);
      setError('');
      
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      
      // Wysłanie zdjęć na serwer
      await AdsService.uploadImages(id, formData);
      
      // Odświeżenie danych ogłoszenia
      const response = await AdsService.getById(id);
      if (response.data) {
        setListing(response.data);
      }
      
      setSuccess('Zdjęcia zostały dodane');
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
      // Wyczyszczenie inputa
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      safeConsole.error('Błąd podczas dodawania zdjęć:', err);
      setError('Nie udało się dodać zdjęć. Spróbuj ponownie później.');
    } finally {
      setUploadingImages(false);
    }
  };
  
  // Obsługa zmiany pól formularza
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableFields(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Aktualizacja lokalnego stanu ogłoszenia
    setListing(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Zapisywanie zmian
  const handleSaveChanges = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      // Walidacja ceny
      const price = parseFloat(editableFields.price);
      if (isNaN(price) || price <= 0) {
        setError('Nieprawidłowa cena pojazdu. Podaj poprawną wartość.');
        setIsSubmitting(false);
        return;
      }
      
      // Przygotowanie danych do aktualizacji
      const updateData = {
        description: editableFields.description,
        price: editableFields.price,
        city: editableFields.city,
        voivodeship: editableFields.voivodeship,
        color: editableFields.color,
        mainImageIndex: selectedImage
      };
      
      safeConsole.log('💾 Zapisuję zmiany w ogłoszeniu:', updateData);
      
      // Aktualizacja ogłoszenia
      await AdsService.update(id, updateData);
      
      safeConsole.log('✅ Ogłoszenie zaktualizowane, wymuszam odświeżenie danych...');
      
      // 🔄 KLUCZOWE: Wymuś odświeżenie danych z czyszczeniem cache
      await refreshListing();
      
      // 📢 Powiadom inne komponenty o aktualizacji
      localStorage.setItem(`listing_updated_${id}`, Date.now().toString());
      
      // Wyślij event do innych okien/tabów
      window.dispatchEvent(new StorageEvent('storage', {
        key: `listing_updated_${id}`,
        newValue: Date.now().toString(),
        url: window.location.href
      }));
      
      setSuccess('Ogłoszenie zostało zaktualizowane');
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      safeConsole.error('Błąd podczas aktualizacji ogłoszenia:', err);
      setError('Nie udało się zaktualizować ogłoszenia. Spróbuj ponownie później.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Obsługa przedłużenia ważności ogłoszenia
  const handleExtendValidity = () => {
    setIsPaymentModalOpen(true);
  };
  
  // Obsługa usunięcia ogłoszenia
  const handleDeleteListing = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć to ogłoszenie? Tej operacji nie można cofnąć.')) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      await AdsService.delete(id);
      
      setSuccess('Ogłoszenie zostało usunięte');
      
      // Przekierowanie do listy ogłoszeń po 2 sekundach
      setTimeout(() => {
        navigate('/profil/listings');
      }, 2000);
    } catch (err) {
      safeConsole.error('Błąd podczas usuwania ogłoszenia:', err);
      setError('Nie udało się usunąć ogłoszenia. Spróbuj ponownie później.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Obsługa zakończenia płatności
  const handlePaymentComplete = async () => {
    try {
      setSuccess('Ważność ogłoszenia została przedłużona o 30 dni!');
      
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setSuccess('');
      }, 2000);
    } catch (error) {
      safeConsole.error('Błąd podczas obsługi zakończenia płatności:', error);
      setError('Wystąpił błąd podczas przedłużania ważności ogłoszenia. Skontaktuj się z obsługą serwisu.');
    }
  };

  // Obliczanie pozostałego czasu ważności ogłoszenia
  const calculateRemainingDays = () => {
    if (!listing || !listing.createdAt) return 0;
    
    const createdDate = new Date(listing.createdAt);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Funkcja do formatowania ścieżek zdjęć
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return '/images/auto-placeholder.jpg';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
      // Dodaj bazowy URL dla zdjęć z serwera
      return `http://localhost:5000${imagePath}`;
    }
  };
  
  // Jeśli dane są wczytywane, wyświetl loader
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#35530A]"></div>
      </div>
    );
  }

  // Jeśli wystąpił błąd, wyświetl komunikat
  if (error && !listing) {
    return (
      <div className="bg-[#FCFCFC] py-8 px-4 lg:px-[15%]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 font-medium">{error}</p>
            <button 
              onClick={() => navigate('/profil/listings')}
              className="mt-4 text-[#35530A] hover:text-[#44671A] font-medium"
            >
              ← Wróć do moich ogłoszeń
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const remainingDays = calculateRemainingDays();
  const isExpiringSoon = remainingDays <= 5;
  const imagesCount = listing?.images?.length || 0;

  return (
    <div className="bg-[#FCFCFC] py-8 px-4 lg:px-[15%]">
      {/* Nagłówek */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate('/profil/listings')}
          className="mb-4 flex items-center gap-2 font-bold text-xl text-black hover:text-gray-700 transition-colors"
        >
          ← Powrót do moich ogłoszeń
        </button>
        <h1 className="text-2xl font-bold">Edycja ogłoszenia</h1>
      </div>

      {/* Komunikaty błędów i sukcesu */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        </div>
      )}
      
      {/* Informacja o wygasaniu ogłoszenia */}
      {isExpiringSoon && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-700 font-medium">
                  Twoje ogłoszenie wygaśnie za {remainingDays} {remainingDays === 1 ? 'dzień' : remainingDays < 5 ? 'dni' : 'dni'}
                </p>
                <p className="text-yellow-600 mt-1">
                  Po wygaśnięciu ogłoszenie zostanie przeniesione do archiwum i nie będzie widoczne dla innych użytkowników.
                </p>
                <button
                  onClick={handleExtendValidity}
                  className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-[2px] transition-colors"
                >
                  Przedłuż ważność ogłoszenia
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Główna zawartość */}
      {listing && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[2px] shadow-md overflow-hidden p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lewa kolumna */}
              <div>
                <h2 className="text-xl font-bold mb-4">Zdjęcia ({imagesCount}/20)</h2>
                
                {/* Główne zdjęcie */}
                <div className="mb-4 aspect-video bg-gray-100 rounded-sm overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={formatImageUrl(listing.images[selectedImage])} 
                      alt="Główne zdjęcie" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Brak zdjęć
                    </div>
                  )}
                </div>
                
                {/* Miniatury zdjęć */}
                <div className="mb-4">
                  <p className="text-gray-700 mb-2">Kliknij na zdjęcie, aby ustawić je jako główne:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {listing.images && listing.images.map((img, index) => (
                      <div 
                        key={index}
                        className={`relative cursor-pointer border-2 ${selectedImage === index ? 'border-[#35530A]' : 'border-gray-200'} rounded-sm overflow-hidden aspect-video group`}
                      >
                        <img 
                          src={formatImageUrl(img)} 
                          alt={`Zdjęcie ${index + 1}`} 
                          className="w-full h-full object-cover"
                          onClick={() => handleSetMainImage(index)}
                        />
                        {/* Przycisk usuwania zdjęcia */}
                        {listing.images.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(index);
                            }}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Usuń zdjęcie"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        {/* Oznaczenie głównego zdjęcia */}
                        {selectedImage === index && (
                          <div className="absolute bottom-1 left-1 bg-[#35530A] text-white text-xs px-2 py-1 rounded">
                            Główne
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Przycisk dodawania zdjęć */}
                    {imagesCount < 20 && (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-gray-300 rounded-sm overflow-hidden aspect-video flex items-center justify-center hover:border-[#35530A] transition-colors"
                      >
                        <div className="text-center">
                          <Plus className="mx-auto h-6 w-6 text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">Dodaj zdjęcie</span>
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleAddImages}
                          accept="image/*"
                          multiple
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                  
                  {uploadingImages && (
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#35530A] mr-2"></div>
                      Dodawanie zdjęć...
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold mb-4">Opis</h2>
                <textarea
                  name="description"
                  value={editableFields.description}
                  onChange={handleInputChange}
                  className="w-full h-40 p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#35530A] focus:outline-none resize-none"
                  placeholder="Opis pojazdu"
                />
              </div>

              {/* Prawa kolumna */}
              <div>
                <h2 className="text-xl font-bold mb-4">Dane podstawowe</h2>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Cena (PLN)</label>
                  <input
                    type="number"
                    name="price"
                    value={editableFields.price}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#35530A] focus:outline-none"
                    min="1"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Miasto</label>
                  <input
                    type="text"
                    name="city"
                    value={editableFields.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#35530A] focus:outline-none"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Województwo</label>
                  <input
                    type="text"
                    name="voivodeship"
                    value={editableFields.voivodeship}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#35530A] focus:outline-none"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Kolor</label>
                  <input
                    type="text"
                    name="color"
                    value={editableFields.color}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#35530A] focus:outline-none"
                  />
                </div>

                {/* Informacje o pojeździe (tylko do odczytu) */}
                <div className="mt-6 mb-6 p-4 bg-gray-50 rounded-sm">
                  <h3 className="font-semibold mb-2 text-gray-700">Informacje o pojeździe</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Marka:</span>
                      <p className="font-medium">{listing.brand || 'Nie podano'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Model:</span>
                      <p className="font-medium">{listing.model || 'Nie podano'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Rok produkcji:</span>
                      <p className="font-medium">{listing.year || 'Nie podano'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Przebieg:</span>
                      <p className="font-medium">{listing.mileage ? `${listing.mileage.toLocaleString()} km` : 'Nie podano'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Paliwo:</span>
                      <p className="font-medium">{listing.fuelType || 'Nie podano'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Moc:</span>
                      <p className="font-medium">{listing.power ? `${listing.power} KM` : 'Nie podano'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * Aby zmienić dane techniczne pojazdu, skontaktuj się z obsługą serwisu: pomoc@autosell.pl
                  </p>
                </div>
                
                <div className="mt-8 flex flex-col space-y-3">
                  <button
                    onClick={handleSaveChanges}
                    className="w-full bg-[#35530A] text-white py-3 rounded-sm hover:bg-[#2A4208] transition-colors"
                    disabled={isSubmitting}
                  >
                    Zapisz zmiany
                  </button>
                  
                  <button
                    onClick={handleDeleteListing}
                    className="w-full bg-red-600 text-white py-3 rounded-sm hover:bg-red-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    Usuń ogłoszenie
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal płatności */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={30}
          listingType="standardowe"
          adId={id}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default EditListingView;
