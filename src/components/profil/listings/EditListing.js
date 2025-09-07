import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ListingsService from '../../../services/api/listingsApi';

// Import komponentów
import ImageManager from './edit/ImageManager';
import BasicInfoForm from './edit/BasicInfoForm';
import VehicleDetailsForm from './edit/VehicleDetailsForm';
import LocationAndExtrasForm from './edit/LocationAndExtrasForm';
import ActionButtons from './edit/ActionButtons';
import { LoadingState, ErrorState } from './edit/LoadingAndErrorStates';

/**
 * Główny komponent do edycji ogłoszenia
 * Prosty kontener, który używa mniejszych komponentów
 */
const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Stany
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '', headline: '', description: '', price: '',
    brand: '', model: '', year: '', mileage: '', color: '', condition: '',
    fuelType: '', transmission: '', bodyType: '', engineCapacity: '', power: '',
    city: '', voivodeship: '', sellerType: '', countryOfOrigin: '',
    firstRegistrationDate: '', lastOfficialMileage: '', purchaseOptions: [],
    mainImageIndex: 0
  });
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState(null);

  // Pobieranie danych
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await ListingsService.getById(id);
        
        let validImages = [];
        let mainImageIndex = 0;
        
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          validImages = data.images.filter(img => img && typeof img === 'string');
          if (data.mainImage && validImages.includes(data.mainImage)) {
            mainImageIndex = validImages.indexOf(data.mainImage);
          }
        }
        
        setImages(validImages);
        setFormData({
          title: `${data.brand || ''} ${data.model || ''}`.trim(),
          headline: data.headline || '', description: data.description || '', price: data.price || '',
          brand: data.brand || '', model: data.model || '', year: data.year || '',
          mileage: data.mileage || '', color: data.color || '', condition: data.condition || '',
          fuelType: data.fuelType || '', transmission: data.transmission || '', bodyType: data.bodyType || '',
          engineCapacity: data.engineCapacity || '', power: data.power || '',
          city: data.city || '', voivodeship: data.voivodeship || '',
          sellerType: data.sellerType || '', countryOfOrigin: data.countryOfOrigin || '',
          firstRegistrationDate: data.firstRegistrationDate || '', lastOfficialMileage: data.lastOfficialMileage || '',
          purchaseOptions: data.purchaseOptions || [], mainImageIndex: mainImageIndex
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Błąd podczas pobierania ogłoszenia:', err);
        setError('Nie udało się pobrać danych ogłoszenia. Spróbuj ponownie później.');
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  // Obsługa zmian
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'brand' || name === 'model' ? {
        title: `${name === 'brand' ? value : formData.brand} ${name === 'model' ? value : formData.model}`.trim()
      } : {})
    }));
  };

  const handleSetMainImage = (index) => {
    setFormData(prev => ({ ...prev, mainImageIndex: index }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + newImages.length + files.length > 15) {
      toast.error('Maksymalna liczba zdjęć to 15.');
      return;
    }
    
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Niektóre pliki są zbyt duże. Maksymalny rozmiar to 5MB.');
      return;
    }
    
    setNewImages(prev => [...prev, ...files]);
  };

  // Funkcja do przesuwania zdjęć
  const handleMoveImage = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
    
    // Aktualizuj mainImageIndex - pierwsze zdjęcie jest zawsze główne
    setFormData(prev => ({ ...prev, mainImageIndex: 0 }));
  };

  const handleRemoveImage = (index, isNew = false) => {
    if (isNew) {
      setNewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setImages(prev => prev.filter((_, i) => i !== index));
      if (index === formData.mainImageIndex) {
        setFormData(prev => ({ ...prev, mainImageIndex: 0 }));
      } else if (index < formData.mainImageIndex) {
        setFormData(prev => ({ ...prev, mainImageIndex: prev.mainImageIndex - 1 }));
      }
    }
  };

  const handleDeleteImage = async (index) => {
    if (images.length <= 1) {
      toast.error('Ogłoszenie musi zawierać co najmniej jedno zdjęcie.');
      return;
    }
    
    try {
      await ListingsService.deleteImage(id, index);
      handleRemoveImage(index);
      toast.success('Zdjęcie zostało usunięte.');
    } catch (err) {
      console.error('Błąd podczas usuwania zdjęcia:', err);
      toast.error('Wystąpił błąd podczas usuwania zdjęcia. Spróbuj ponownie.');
    }
  };

  // Zapisywanie
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const totalImages = images.length + newImages.length;
    
    if (totalImages === 0) {
      toast.error('Ogłoszenie musi zawierać co najmniej jedno zdjęcie.');
      return;
    }
    
    if (totalImages < 5) {
      toast.error('Ogłoszenie musi zawierać co najmniej 5 zdjęć.');
      return;
    }
    
    try {
      setSaving(true);
      const formDataToSend = new FormData();
      
      // Dodanie pól
      const fieldsToSend = [
        'headline', 'description', 'price', 'brand', 'model', 'year', 'mileage', 
        'color', 'condition', 'fuelType', 'transmission', 'bodyType', 'engineCapacity', 
        'power', 'city', 'voivodeship', 'sellerType', 'countryOfOrigin',
        'firstRegistrationDate', 'lastOfficialMileage'
      ];
      
      fieldsToSend.forEach(field => {
        if (formData[field] !== undefined && formData[field] !== '') {
          formDataToSend.append(field, formData[field]);
        }
      });
      
      // Obsługa purchaseOptions - bezpieczne sprawdzenie
      if (formData.purchaseOptions) {
        if (Array.isArray(formData.purchaseOptions) && formData.purchaseOptions.length > 0) {
          formData.purchaseOptions.forEach(option => {
            formDataToSend.append('purchaseOptions[]', option);
          });
        } else if (typeof formData.purchaseOptions === 'string' && formData.purchaseOptions.trim() !== '') {
          formDataToSend.append('purchaseOptions[]', formData.purchaseOptions);
        }
      }
      
      // Wyślij kolejność zdjęć do backendu
      if (images && images.length > 0) {
        formDataToSend.append('imageOrder', JSON.stringify(images));
        console.log('Wysyłanie kolejności zdjęć:', images);
      }
      
      formDataToSend.append('mainImageIndex', 0); // Zawsze pierwsze zdjęcie
      
      // Dodanie nowych zdjęć
      newImages.forEach(file => {
        formDataToSend.append('images', file);
      });
      
      await ListingsService.update(id, formDataToSend);
      toast.success('Ogłoszenie zostało zaktualizowane!');
      setSaving(false);
      
      // Dodaj parametr do URL żeby wymusić odświeżenie danych
      navigate('/profil/listings?refresh=true');
    } catch (err) {
      console.error('Błąd podczas aktualizacji ogłoszenia:', err);
      toast.error('Wystąpił błąd podczas zapisywania zmian. Spróbuj ponownie.');
      setSaving(false);
    }
  };

  // Renderowanie
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl">
          <form onSubmit={handleSubmit}>
            {/* Zarządzanie zdjęciami */}
            <ImageManager
              images={images}
              newImages={newImages}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
              onDeleteImage={handleDeleteImage}
              onMoveImage={handleMoveImage}
            />
            
            {/* Podstawowe informacje */}
            <BasicInfoForm
              formData={formData}
              onChange={handleChange}
            />
            
            {/* Dane techniczne pojazdu */}
            <VehicleDetailsForm
              formData={formData}
              onChange={handleChange}
            />
            
            {/* Lokalizacja i dodatkowe informacje */}
            <LocationAndExtrasForm
              formData={formData}
              onChange={handleChange}
            />
            
            {/* Przyciski akcji */}
            <ActionButtons
              saving={saving}
              onSubmit={handleSubmit}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListing;
