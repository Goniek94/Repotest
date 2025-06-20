import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, Save, Trash2, Upload, Image as ImageIcon, 
  CheckCircle, AlertTriangle, X, RefreshCw
} from 'lucide-react';
import ListingsService from '../../../services/api/listingsApi';
import getImageUrl from '../../../utils/responsive/getImageUrl';

/**
 * Komponent do edycji ogłoszenia
 * Umożliwia edycję podstawowych informacji oraz zarządzanie zdjęciami
 */
const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Stany komponentu
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    headline: '',
    description: '',
    price: '',
    mainImageIndex: 0
  });
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState(null);

  // Pobieranie danych ogłoszenia
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await ListingsService.getById(id);
        
        // Ustawienie danych ogłoszenia
        setListing(data);
        setFormData({
          title: `${data.brand} ${data.model}`,
          headline: data.headline || '',
          description: data.description || '',
          price: data.price || '',
          mainImageIndex: data.mainImageIndex || 0
        });
        
        // Przygotowanie tablicy zdjęć - bezpieczne przetwarzanie
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          // Filtrujemy puste lub nieprawidłowe ścieżki
          const validImages = data.images.filter(img => img && typeof img === 'string');
          setImages(validImages);
        } else {
          setImages([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Błąd podczas pobierania ogłoszenia:', err);
        setError('Nie udało się pobrać danych ogłoszenia. Spróbuj ponownie później.');
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  // Obsługa zmiany pól formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Obsługa zmiany głównego zdjęcia
  const handleSetMainImage = (index) => {
    setFormData(prev => ({
      ...prev,
      mainImageIndex: index
    }));
  };

  // Obsługa dodawania nowych zdjęć
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Sprawdzenie liczby zdjęć (max 10 łącznie)
    if (images.length + newImages.length + files.length > 10) {
      toast.error('Maksymalna liczba zdjęć to 10.');
      return;
    }
    
    // Sprawdzenie rozmiaru plików (max 5MB każdy)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Niektóre pliki są zbyt duże. Maksymalny rozmiar to 5MB.');
      return;
    }
    
    // Dodanie nowych zdjęć do stanu
    setNewImages(prev => [...prev, ...files]);
  };

  // Obsługa usuwania zdjęć
  const handleRemoveImage = (index, isNew = false) => {
    if (isNew) {
      // Usuwanie nowego zdjęcia
      setNewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Usuwanie istniejącego zdjęcia
      setImages(prev => prev.filter((_, i) => i !== index));
      
      // Aktualizacja indeksu głównego zdjęcia, jeśli usuwane jest główne zdjęcie
      if (index === formData.mainImageIndex) {
        setFormData(prev => ({
          ...prev,
          mainImageIndex: 0
        }));
      } else if (index < formData.mainImageIndex) {
        // Jeśli usuwane zdjęcie jest przed głównym, trzeba zaktualizować indeks
        setFormData(prev => ({
          ...prev,
          mainImageIndex: prev.mainImageIndex - 1
        }));
      }
    }
  };

  // Usunięto zbędny efekt debugowania, który mógł powodować pętlę renderowania

  // Zapisywanie zmian
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Przygotowanie danych formularza
      const formDataToSend = new FormData();
      
      // Dodanie podstawowych informacji
      formDataToSend.append('headline', formData.headline);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('mainImageIndex', formData.mainImageIndex);
      
      // Dodanie nowych zdjęć
      newImages.forEach(file => {
        formDataToSend.append('images', file);
      });
      
      // Wysłanie żądania aktualizacji
      await ListingsService.update(id, formDataToSend);
      
      toast.success('Ogłoszenie zostało zaktualizowane!');
      setSaving(false);
      
      // Przekierowanie do listy ogłoszeń
      navigate('/profil/listings');
    } catch (err) {
      console.error('Błąd podczas aktualizacji ogłoszenia:', err);
      toast.error('Wystąpił błąd podczas zapisywania zmian. Spróbuj ponownie.');
      setSaving(false);
    }
  };

  // Usuwanie zdjęcia z serwera
  const handleDeleteImage = async (index) => {
    if (images.length <= 1) {
      toast.error('Ogłoszenie musi zawierać co najmniej jedno zdjęcie.');
      return;
    }
    
    try {
      console.log(`Usuwanie zdjęcia o indeksie ${index}:`, images[index]);
      await ListingsService.deleteImage(id, index);
      
      // Aktualizacja lokalnego stanu
      handleRemoveImage(index);
      
      toast.success('Zdjęcie zostało usunięte.');
    } catch (err) {
      console.error('Błąd podczas usuwania zdjęcia:', err);
      toast.error('Wystąpił błąd podczas usuwania zdjęcia. Spróbuj ponownie.');
    }
  };

  // Renderowanie stanu ładowania
  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-[#35530A] border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600 text-lg">Ładowanie danych ogłoszenia...</p>
          </div>
        </div>
      </div>
    );
  }

  // Renderowanie błędu
  if (error) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-8">
            <div className="flex items-center justify-center flex-col">
              <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Wystąpił błąd</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => navigate('/profil/listings')}
                className="flex items-center px-4 py-2 bg-[#35530A] text-white rounded-md hover:bg-[#2A4208] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Wróć do listy ogłoszeń
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Usunięto nagłówek i strzałkę powrotu, ponieważ są już dostępne w panelu nawigacyjnym */}

        {/* Główny formularz */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl">
          <form onSubmit={handleSubmit}>
            {/* Zarządzanie zdjęciami - teraz jako pierwsze */}
            <div className="p-6 border-b border-gray-200 bg-gray-50/30">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 mr-2 text-[#35530A]" /> Zdjęcia
              </h2>
              
              {/* Zdjęcia */}
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
                    // Jeśli są zdjęcia, pokaż je wraz z kafelkiem "Dodaj zdjęcie" na końcu (jeśli jest mniej niż 10 zdjęć)
                    <>
                      {images.map((image, index) => (
                        <div 
                          key={index} 
                          className={`relative rounded-lg overflow-hidden border-2 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 duration-200 ${
                            index === formData.mainImageIndex 
                              ? 'border-[#35530A] ring-2 ring-[#35530A]/30' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img 
                            src={getImageUrl(image)} 
                            alt={`Zdjęcie ${index + 1}`}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              console.error(`Błąd ładowania zdjęcia ${index}:`, image);
                              e.target.onerror = null;
                              e.target.src = "/images/placeholder.jpg";
                              // Pokaż toast z informacją o błędzie
                              toast.error(`Nie udało się załadować zdjęcia ${index + 1}. Spróbuj odświeżyć stronę.`);
                            }}
                          />
                          
                          {/* Ikona gwiazdki dla zdjęcia głównego */}
                          {index === formData.mainImageIndex ? (
                            <div className="absolute top-2 left-2 bg-[#35530A] text-white rounded-full p-1.5 shadow-md">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleSetMainImage(index);
                              }}
                              className="absolute top-2 left-2 bg-white/80 hover:bg-white text-[#35530A] rounded-full p-1.5 shadow-sm hover:shadow-md transition-all"
                              title="Ustaw jako główne zdjęcie"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          
                          {/* Przycisk usuwania */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteImage(index);
                            }}
                            className="absolute top-2 right-2 bg-white/80 hover:bg-red-500 text-red-500 hover:text-white rounded-full p-1.5 shadow-sm hover:shadow-md transition-all"
                            title="Usuń zdjęcie"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Kafelek "Dodaj zdjęcie" - widoczny tylko gdy jest mniej niż 10 zdjęć */}
                      {images.length < 10 && (
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
                  onChange={handleImageChange}
                />
                
                <p className="text-sm text-gray-500 mt-2">
                  Możesz dodać maksymalnie {10 - images.length} nowych zdjęć (łącznie max. 10). 
                  Maksymalny rozmiar pliku: 5MB.
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
                            handleRemoveImage(index, true);
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
            
            {/* Informacje podstawowe - teraz jako drugie */}
            <div className="p-6 bg-white">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-[#35530A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Informacje podstawowe
              </h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Tytuł ogłoszenia
                </label>
                <input
                  type="text"
                  value={formData.title}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Tytuł ogłoszenia jest generowany automatycznie na podstawie marki i modelu.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="headline">
                  Nagłówek ogłoszenia
                </label>
                <input
                  type="text"
                  id="headline"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] transition-all duration-200"
                  placeholder="Krótki opis, np. 'Pierwszy właściciel, bezwypadkowy'"
                  maxLength={100}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Krótki opis, który będzie wyświetlany pod tytułem ogłoszenia (max. 100 znaków)
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                  Opis ogłoszenia
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] transition-all duration-200"
                  placeholder="Szczegółowy opis pojazdu..."
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
                  Cena (PLN)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] transition-all duration-200"
                  placeholder="Cena w złotych"
                  min="0"
                  step="1"
                />
              </div>
            </div>
            
            {/* Przyciski akcji */}
            <div className="px-6 py-6 bg-gray-50/30 border-t border-gray-200 flex justify-center">
              <button
                type="submit"
                disabled={saving}
                className={`px-8 py-3 rounded-md text-white font-medium text-lg flex items-center justify-center min-w-[200px] ${
                  saving ? 'bg-[#4A6B2A]' : 'bg-[#35530A] hover:bg-[#2A4208]'
                } transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1`}
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Zapisywanie...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" /> Zapisz zmiany
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListing;
