import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, Flag, Phone, Mail, MapPin, Calendar, Gauge, Fuel, Settings, Car } from 'lucide-react';
import { useFavorites } from '../FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import TechnicalDetails from '../components/listings/details/TechnicalDetails';
import ContactInfo from '../components/listings/details/ContactInfo';

const ListingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isFavorite = favorites.some(fav => fav.id === listing?.id);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/ads/${id}`);
        if (!response.ok) {
          throw new Error('Nie udało się pobrać ogłoszenia');
        }
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isFavorite) {
      removeFavorite(listing.id);
    } else {
      addFavorite(listing);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Sprawdź to ogłoszenie: ${listing.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Błąd podczas udostępniania:', err);
      }
    } else {
      // Fallback - kopiowanie do schowka
      navigator.clipboard.writeText(window.location.href);
      alert('Link został skopiowany do schowka!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wystąpił błąd</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Wróć do strony głównej
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ogłoszenie nie zostało znalezione</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Wróć do strony głównej
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="relative">
                {listing.photos && listing.photos.length > 0 ? (
                  <img
                    src={listing.photos[currentImageIndex]}
                    alt={listing.title}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <Car className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                {/* Image Navigation */}
                {listing.photos && listing.photos.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2">
                      {listing.photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Strip */}
              {listing.photos && listing.photos.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {listing.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded border-2 overflow-hidden ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`${listing.title} - zdjęcie ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title and Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Dodano: {new Date(listing.createdAt).toLocaleDateString('pl-PL')}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-2 rounded-full border ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full border bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  
                  <button className="p-2 rounded-full border bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100">
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-blue-600 mb-4">
                {listing.price ? `${listing.price.toLocaleString('pl-PL')} zł` : 'Cena do uzgodnienia'}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Rok</div>
                    <div className="font-semibold">{listing.year || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Gauge className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Przebieg</div>
                    <div className="font-semibold">{listing.mileage ? `${listing.mileage.toLocaleString('pl-PL')} km` : 'N/A'}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Fuel className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Paliwo</div>
                    <div className="font-semibold">{listing.fuelType || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Settings className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Skrzynia</div>
                    <div className="font-semibold">{listing.transmission || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Opis</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {listing.description || 'Brak opisu dla tego ogłoszenia.'}
                </p>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dane techniczne</h2>
              <TechnicalDetails listing={listing} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-4">
              <ContactInfo listing={listing} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;
