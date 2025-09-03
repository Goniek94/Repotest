import { useState } from 'react';
import AdsService from '../../../services/ads';

export const useListingSubmission = (uploadImages) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adId, setAdId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to map form data to backend format
  const mapFormDataToBackend = (formData, listingType) => {
    // Function to parse numbers with spaces
    const parseNumberWithSpaces = (value) => {
      if (!value) return undefined;
      // Remove all spaces and other non-alphanumeric characters except digits
      const cleanValue = value.toString().replace(/[^\d]/g, '');
      const parsed = parseInt(cleanValue, 10);
      return isNaN(parsed) ? undefined : parsed;
    };

    // Mappings from frontend to backend values
    const fuelTypeMapping = {
      'Benzyna': 'Benzyna',
      'Diesel': 'Diesel', 
      'Elektryczny': 'Elektryczny',
      'Hybryda': 'Hybryda',
      'Hybrydowy': 'Hybrydowy',
      'Benzyna+LPG': 'Benzyna+LPG',
      'Benzyna+CNG': 'Benzyna+LPG', // map CNG to LPG as closest match
      'Etanol': 'Inne'
    };

    const transmissionMapping = {
      'Manualna': 'Manualna',
      'Automatyczna': 'Automatyczna',
      'Półautomatyczna': 'Półautomatyczna',
      'Bezstopniowa CVT': 'Automatyczna' // map CVT to automatic
    };

    const conditionMapping = {
      'Nowy': 'Nowy',
      'Używany': 'Używany'
    };

    const booleanMapping = {
      'Tak': 'Tak',
      'Nie': 'Nie',
      'Bezwypadkowy': 'Nie',
      'Powypadkowy': 'Tak',
      'Nieuszkodzony': 'Nie',
      'Uszkodzony': 'Tak'
    };

    return {
      // Basic information
      brand: formData.brand || '',
      model: formData.model || '',
      generation: formData.generation || '',
      version: formData.version || '',
      year: parseInt(formData.productionYear || formData.year || '2010'),
      productionYear: parseInt(formData.productionYear || formData.year || '2010'),
      price: parseNumberWithSpaces(formData.price) || 10000,
      mileage: parseNumberWithSpaces(formData.mileage) || 100000,
      fuelType: fuelTypeMapping[formData.fuelType] || 'Benzyna',
      transmission: transmissionMapping[formData.transmission] || 'Manualna',
      vin: formData.vin || '',
      registrationNumber: formData.registrationNumber || '',
      headline: formData.headline || `${formData.brand || ''} ${formData.model || ''}`.trim(),
      description: formData.description || 'Brak opisu',
      
      // Purchase options - mapping from frontend to backend
      purchaseOptions: (() => {
        const option = formData.purchaseOption || formData.purchaseOptions;
        const mapping = {
          'sprzedaz': 'Sprzedaż',
          'faktura': 'Faktura VAT', 
          'inne': 'Inne',
          'najem': 'Inne',
          'leasing': 'Inne'
        };
        return mapping[option] || 'Sprzedaż';
      })(),
      rentalPrice: parseNumberWithSpaces(formData.rentalPrice),
      negotiable: formData.negotiable || 'Nie',
      
      // Listing and seller type
      listingType,
      sellerType: (() => {
        const sellerTypeMapping = {
          'Prywatny': 'Prywatny',
          'Firma': 'Firma'
        };
        return sellerTypeMapping[formData.sellerType] || 'Prywatny';
      })(),
      
      // Vehicle condition
      condition: conditionMapping[formData.condition] || 'Używany',
      accidentStatus: booleanMapping[formData.accidentStatus] || 'Nie',
      damageStatus: booleanMapping[formData.damageStatus] || 'Nie',
      tuning: booleanMapping[formData.tuning] || 'Nie',
      imported: booleanMapping[formData.imported] || 'Nie',
      registeredInPL: booleanMapping[formData.registeredInPL] || 'Tak',
      firstOwner: booleanMapping[formData.firstOwner] || 'Nie',
      disabledAdapted: booleanMapping[formData.disabledAdapted] || 'Nie',
      
      // Body and appearance
      bodyType: formData.bodyType || '',
      color: formData.color || '',
      doors: formData.doors ? parseInt(formData.doors) : undefined,
      
      // Technical data - use parseNumberWithSpaces for proper parsing
      lastOfficialMileage: parseNumberWithSpaces(formData.lastOfficialMileage),
      power: parseNumberWithSpaces(formData.power) || 100,
      engineSize: parseNumberWithSpaces(formData.engineSize),
      drive: formData.drive || 'Przedni',
      weight: parseNumberWithSpaces(formData.weight),
      countryOfOrigin: formData.countryOfOrigin || '',
      
      // Location
      voivodeship: formData.voivodeship || '',
      city: formData.city || '',
      
      // Images - convert to array of strings (URLs from Supabase)
      images: (() => {
        // Priority 1: Check if we already have URLs from Supabase in formData.images
        if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
          // If these are already strings (URLs), return them
          if (typeof formData.images[0] === 'string') {
            return formData.images;
          }
          // If these are objects with url, extract URLs
          return formData.images.map(img => img.url || img.src || img).filter(Boolean);
        }
        
        // Priority 2: Check photos (base64 - will be uploaded to Supabase later)
        if (formData.photos && Array.isArray(formData.photos) && formData.photos.length > 0) {
          // Return empty - photos will be uploaded to Supabase after creating listing
          return [];
        }
        
        return [];
      })(),
      mainImage: (() => {
        // Priority 1: mainImage as string (URL from Supabase)
        if (formData.mainImage && typeof formData.mainImage === 'string') {
          return formData.mainImage;
        }
        
        // Priority 2: mainImage as object with url
        if (formData.mainImage && typeof formData.mainImage === 'object') {
          return formData.mainImage.url || formData.mainImage.src || '';
        }
        
        // Priority 3: First image from images list
        if (formData.images && formData.images.length > 0) {
          const firstImage = formData.images[0];
          if (typeof firstImage === 'string') {
            return firstImage;
          }
          return firstImage.url || firstImage.src || '';
        }
        
        // Priority 4: First image from photos (base64 - temporary)
        if (formData.photos && formData.photos.length > 0) {
          const mainPhotoIndex = formData.mainPhotoIndex || 0;
          const mainPhoto = formData.photos[mainPhotoIndex];
          return mainPhoto?.src || formData.photos[0]?.src || '';
        }
        
        return '';
      })(),
      
      // Status
      status: 'pending'
    };
  };

  // Function to publish listing
  const publishListing = async (listingData, listingType, acceptedTerms, carConditionConfirmed, setListingData) => {
    if (!acceptedTerms || !carConditionConfirmed) {
      setError('Proszę zaznaczyć wymagane zgody (regulamin i stan auta).');
      return null;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      // Map form data to backend format (without images)
      const backendData = mapFormDataToBackend(listingData, listingType);
      
      // STEP 1: First create listing without images
      const response = await AdsService.addListing(backendData);
      const realCarId = response.data._id;
      
      // STEP 2: If we have images, upload them with real listing ID
      if (listingData.photos && listingData.photos.length > 0) {
        const filesToUpload = listingData.photos
          .filter(photo => photo.file && photo.file instanceof File)
          .map(photo => photo.file);
        
        const mainPhotoIndex = listingData.mainPhotoIndex || 0;
        const mainImageFile = listingData.photos[mainPhotoIndex]?.file;
        
        if (filesToUpload.length > 0) {
          try {
            // Upload images to Supabase with real listing ID
            const uploadedImages = await uploadImages(filesToUpload, realCarId, mainImageFile);
            
            if (uploadedImages && uploadedImages.length > 0) {
              // STEP 3: Update listing with image URLs
              const imageData = {
                images: uploadedImages.map(img => img.url),
                mainImage: uploadedImages.find(img => img.isMain)?.url || uploadedImages[0]?.url
              };
              
              await AdsService.updateListingImages(realCarId, imageData);
              
              // STEP 4: Fetch fresh listing data from API (with real Supabase URLs)
              try {
                const freshAdResponse = await AdsService.getById(realCarId);
                const freshAdData = freshAdResponse.data;
                
                // Update form data with real image URLs
                setListingData(prev => ({
                  ...prev,
                  images: freshAdData.images || [],
                  mainImage: freshAdData.mainImage || '',
                  // Remove old photos (base64) and replace with real URLs
                  photos: freshAdData.images ? freshAdData.images.map((url, index) => ({
                    id: Date.now() + index,
                    src: url,
                    name: `Zdjęcie ${index + 1}`,
                    url: url
                  })) : []
                }));
                
                console.log('✅ Updated listing data with real Supabase URLs:', freshAdData.images);
              } catch (fetchError) {
                console.error('Error fetching fresh listing data:', fetchError);
              }
            }
          } catch (imageError) {
            console.error('Error uploading images:', imageError);
            // Listing was already created, but without images
            setError(`Ogłoszenie zostało utworzone, ale wystąpił błąd podczas przesyłania zdjęć: ${imageError.message}`);
          }
        }
      }
      
      // Set listing ID for payment
      setAdId(realCarId);
      return realCarId;

    } catch (error) {
      console.error('Error publishing listing:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server error
        const errorMessage = error.response.data?.message || 'Wystąpił błąd podczas publikacji ogłoszenia.';
        setError(errorMessage);
      } else if (error.request) {
        // No connection to server
        setError('Brak połączenia z serwerem. Sprawdź połączenie internetowe.');
      } else {
        // Other error
        setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
      }
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle payment completion
  const handlePaymentComplete = async (navigate) => {
    try {
      // Update listing status after payment
      if (adId) {
        await AdsService.updateStatus(adId, 'active');
      }
      
      setSuccess('Ogłoszenie zostało pomyślnie opublikowane! Za chwilę nastąpi przekierowanie...');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        if (adId) {
          navigate(`/listing/${adId}`);
        } else {
          navigate('/');
        }
      }, 3000);
    } catch (error) {
      console.error('Error updating listing status:', error);
      setError(error.response?.data?.message || 'Wystąpił błąd podczas publikacji ogłoszenia.');
      
      // Even if status update failed, redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  return {
    isSubmitting,
    adId,
    error,
    success,
    setError,
    setSuccess,
    publishListing,
    handlePaymentComplete
  };
};
