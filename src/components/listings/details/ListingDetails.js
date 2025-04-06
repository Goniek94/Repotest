// src/components/ListingsView/createlisting/ListingDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from './ImageGallery';
import TechnicalDetails from './TechnicalDetails';
import Description from './Description';
import ContactInfo from './ContactInfo';
import CommentSection from './CommentSection';
import SimilarListings from './SimilarListings';
import api from '../../../services/api';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [similarListings, setSimilarListings] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        console.log("Próba pobrania ogłoszenia ID:", id);
        
        try {
          console.log(`Wysyłanie żądania GET do /ads/${id}`);
          
          // Używamy bezpośrednio fetch zamiast api.getListing
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/api/ads/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Serwer zwrócił kod błędu: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("Pobrane ogłoszenie:", data);
          
          // Przekształć dane z backendu, aby zawierały wszystkie pola formularza
          const enhancedListing = {
            ...data,
            // Podstawowe pola, które mogą mieć różne nazwy
            make: data.make || data.brand,
            brand: data.brand || data.make,
            model: data.model,
            generation: data.generation,
            version: data.version,
            year: data.year,
            productionYear: data.productionYear || data.year,
            mileage: data.mileage,
            
            // Pola związane ze stanem pojazdu
            condition: data.condition || 'Używany', // Domyślnie "Używany" jeśli brak
            accidentStatus: data.accidentStatus,
            damageStatus: data.damageStatus,
            firstOwner: data.firstOwner,
            registeredInPL: data.registeredInPL,
            imported: data.imported,
            tuning: data.tuning,
            disabledAdapted: data.disabledAdapted,
            
            // Pola techniczne
            fuelType: data.fuelType || data.fuel,
            fuel: data.fuel || data.fuelType,
            engineSize: data.engineSize,
            power: data.power,
            transmission: data.transmission,
            drive: data.drive,
            bodyType: data.bodyType,
            color: data.color,
            doors: data.doors,
            seats: data.seats,
            weight: data.weight,
            lastOfficialMileage: data.lastOfficialMileage,
            countryOfOrigin: data.countryOfOrigin,
            vin: data.vin
          };
          
          // Ustaw dane ogłoszenia
          setListing(enhancedListing);
          
          // Przykładowe komentarze
          setComments([
            {
              id: 1,
              author: 'Jan Kowalski',
              text: 'Świetny samochód, miałem okazję oglądać na żywo. Polecam!',
              date: '2024-03-01',
              isEditing: false
            },
            {
              id: 2,
              author: 'Anna Nowak',
              text: 'Czy możliwe jest negocjowanie ceny?',
              date: '2024-03-02',
              isEditing: false
            }
          ]);
          
          // Pobieranie podobnych ogłoszeń
          try {
            // Używamy bezpośrednio fetch dla podobnych ogłoszeń
            const searchParams = new URLSearchParams({
              brand: data.brand || data.make
            });
            
            const similarResponse = await fetch(`http://localhost:5000/api/ads/search?${searchParams}`, {
              method: 'GET',
              headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
              }
            });
            
            if (!similarResponse.ok) {
              throw new Error(`Błąd pobierania podobnych ogłoszeń: ${similarResponse.status}`);
            }
            
            const similarData = await similarResponse.json();
            
            // Filtrujemy, żeby nie pokazywać aktualnego ogłoszenia
            const filteredSimilar = similarData.ads?.filter(ad => ad._id !== id) || [];
            
            // Formatujemy podobne ogłoszenia
            const formattedSimilar = filteredSimilar.slice(0, 3).map(ad => ({
              id: ad._id,
              title: `${ad.brand || ad.make || ''} ${ad.model || ''}`.trim() || 'Ogłoszenie',
              price: `${ad.price?.toLocaleString() || 0} zł`,
              year: ad.year?.toString() || 'Nieznany',
              mileage: `${ad.mileage?.toLocaleString() || 0} km`,
              image: ad.images && ad.images.length > 0 ? 
                (ad.images[0].startsWith('http') ? ad.images[0] : `http://localhost:5000${ad.images[0]}`) : 
                '/images/auto-788747_1280.jpg'
            }));
            
            setSimilarListings(formattedSimilar);
          } catch (err) {
            console.error("Błąd pobierania podobnych ogłoszeń:", err);
            setSimilarListings([]);
          }
          
        } catch (apiError) {
          console.error("Błąd podczas pobierania danych:", apiError);
          
          throw apiError;
        }
        
      } catch (err) {
        console.error('Błąd pobierania szczegółów ogłoszenia:', err);
        setError('Nie udało się załadować szczegółów ogłoszenia');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchListing();
    }
  }, [id]);

  // Obsługa komentarzy
  const handleAddComment = (text) => {
    const newComment = {
      id: comments.length + 1,
      author: 'Użytkownik',
      text,
      date: new Date().toISOString().split('T')[0],
      isEditing: false
    };
    setComments([...comments, newComment]);
  };

  const handleEditComment = (commentId) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? {...comment, isEditing: !comment.isEditing} : comment
    ));
  };

  const handleSaveComment = (commentId, newText) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? {...comment, text: newText, isEditing: false} : comment
    ));
  };

  if (loading) {
    return (
      <div className="bg-[#FCFCFC] py-8 px-4 lg:px-[15%] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#35530A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FCFCFC] py-8 px-4 lg:px-[15%] min-h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-sm">
          <p className="text-red-700 font-medium">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 text-[#35530A] hover:text-[#44671A] font-medium"
          >
            ← Wróć do ogłoszeń
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="bg-[#FCFCFC] py-8 px-4 lg:px-[15%] min-h-screen">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-sm">
          <p className="text-yellow-700 font-medium">Nie znaleziono ogłoszenia</p>
          <button 
            onClick={() => navigate('/listings')}
            className="mt-4 text-[#35530A] hover:text-[#44671A] font-medium"
          >
            ← Wróć do listy ogłoszeń
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFCFC] py-8 px-4 lg:px-[15%]">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 font-bold text-xl text-black hover:text-gray-700 transition-colors"
      >
        ← Powrót do ogłoszeń
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lewa kolumna (60%) */}
          <div className="w-full lg:w-[60%] space-y-8">
            {/* Galeria zdjęć */}
            <ImageGallery images={Array.isArray(listing.images) ? 
              listing.images.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`) : 
              []} 
            />

            {/* Opis */}
            <Description description={listing.description} />

            {/* Komentarze */}
            <CommentSection 
              comments={comments}
              onAddComment={handleAddComment}
              onEditComment={handleEditComment}
              onSaveComment={handleSaveComment}
            />
          </div>

          {/* Prawa kolumna (40%) */}
          <div className="w-full lg:w-[40%] space-y-8">
            {/* Tytuł i cena */}
            <div className="bg-white p-6 shadow-md rounded-sm">
              <h1 className="text-2xl font-bold text-black mb-4">
                {(listing.brand || listing.make) && listing.model 
                  ? `${listing.brand || listing.make} ${listing.model}${listing.generation ? ' ' + listing.generation : ''}${listing.version ? ' ' + listing.version : ''}`
                  : (listing.title || 'Ogłoszenie')}
              </h1>
              <div className="text-3xl font-black text-[#35530A]">
                {listing.price ? `${listing.price.toLocaleString()} zł` : 'Cena na żądanie'}
              </div>
            </div>

            {/* Dane techniczne */}
            <TechnicalDetails listing={listing} />

            {/* Kontakt */}
            <ContactInfo listing={listing} />
          </div>
        </div>

        {/* Podobne ogłoszenia */}
        {similarListings.length > 0 && (
          <SimilarListings listings={similarListings} />
        )}
      </div>
    </div>
  );
};

export default ListingDetails;