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
        
        setListing(data);
        setFormData({
          title: `${data.brand} ${data.model}`,
          headline: data.headline || '',
          description: data.description || '',
          price: data.price || '',
          mainImageIndex: data.mainImageIndex || 0
        });
        
        // Przygotowanie tablicy zdjęć
        if (data.images && data.images.length > 0) {
          setImages(data.images.map(img => ({ url: img, isExisting: true })));
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600 text-lg">Ładowanie danych ogłoszenia...</p>
          </div>
        </div>
      </div>
    );
  }

  // Renderowanie błędu
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-8">
            <div className="flex items-center justify-center flex-col">
              <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Wystąpił błąd</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => navigate('/profil/listings')}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nagłówek */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/profil/listings')}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              title="Wróć do listy ogłoszeń"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Edycja ogłoszenia</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`flex items-center px-5 py-2.5 rounded-md text-white font-medium ${
              saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors shadow-md`}
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

        {/* Główny formularz */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Informacje podstawowe */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informacje podstawowe</h2>
              
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cena w złotych"
                  min="0"
                  step="1"
                />
              </div>
            </div>
            
            {/* Zarządzanie zdjęciami */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Zdjęcia</h2>
              
              {/* Istniejące zdjęcia */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Obecne zdjęcia</h3>
                
                {images.length === 0 ? (
                  <p className="text-gray-500 italic">Brak zdjęć</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div 
                        key={index} 
                        className={`relative rounded-lg overflow-hidden border-2 ${
                          index === formData.mainImageIndex 
                            ? 'border-blue-500 ring-2 ring-blue-300' 
                            : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src={getImageUrl(image.url)} 
                          alt={`Zdjęcie ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                          {index === formData.mainImageIndex ? (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full absolute top-2 left-2">
                              Główne
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleSetMainImage(index);
                              }}
                              className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full absolute top-2 left-2"
                            >
                              Ustaw jako główne
                            </button>
                          )}
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteImage(index);
                            }}
                            className="bg-red-500 text-white p-2 rounded-full absolute bottom-2 right-2"
                            title="Usuń zdjęcie"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Dodawanie nowych zdjęć */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Dodaj nowe zdjęcia</h3>
                
                <div className="flex flex-wrap gap-4">
                  {/* Przycisk dodawania zdjęć */}
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500 text-center">
                        <span className="font-medium">Kliknij</span> lub przeciągnij
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageChange}
                    />
                  </label>
                  
                  {/* Podgląd nowych zdjęć */}
                  {newImages.map((file, index) => (
                    <div key={index} className="relative w-32 h-32 border border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Nowe zdjęcie ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveImage(index, true);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                        title="Usuń zdjęcie"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  Możesz dodać maksymalnie {10 - images.length} nowych zdjęć (łącznie max. 10). 
                  Maksymalny rozmiar pliku: 5MB.
                </p>
              </div>
            </div>
            
            {/* Przyciski akcji */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/profil/listings')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Anuluj
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2 rounded-md text-white font-medium ${
                  saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors shadow-md`}
              >
                {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListing;
