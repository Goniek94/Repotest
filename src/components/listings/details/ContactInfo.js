// Nowa, czysta wersja ContactInfo z podziałem na podkomponenty
import React, { useState } from "react";
import { MapPin, Facebook, Heart, Phone, Mail, Info, Clock, Eye, MessageCircle } from "lucide-react";
import PhoneSection from "./PhoneSection";
import MessageButton from "./MessageButton";

// Proste SVG dla Gmail i WhatsApp
const GmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="8" fill="#fff"/>
    <path d="M8 14v20a2 2 0 002 2h28a2 2 0 002-2V14l-16 12L8 14z" fill="#EA4335"/>
    <path d="M8 14l16 12 16-12" stroke="#EA4335" strokeWidth="2"/>
    <path d="M8 14v20a2 2 0 002 2h28a2 2 0 002-2V14" stroke="#34A853" strokeWidth="2"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="8" fill="#fff"/>
    <path d="M24 8a16 16 0 00-13.9 23.7L8 40l8.5-2.2A16 16 0 1024 8z" fill="#25D366"/>
    <path d="M20.5 18.5c.5-1 1.5-1.5 2.5-1.5s2 .5 2.5 1.5l1 2c.5 1-.5 2-1.5 2.5l-1.5.5c-.5.5-1.5.5-2 0l-1.5-.5c-1-.5-2-1.5-1.5-2.5l1-2z" fill="#fff"/>
  </svg>
);

const ContactInfo = ({ listing }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`
        );
        break;
      case "gmail":
        window.open(
          `mailto:?subject=${listing?.title || `${listing?.make} ${listing?.model}`}&body=${url}`
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(url)}`
        );
        break;
      default:
        navigator.clipboard.writeText(url);
        alert("Link został skopiowany do schowka!");
    }
  };

  // Format daty
  const formatDate = (dateString) => {
    if (!dateString) return "Nieznana data";
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center border-b border-gray-100 pb-3">
        <span className="bg-gradient-to-r from-green-600 to-green-400 text-white p-2 rounded-full mr-3 shadow-md">
          <MapPin className="w-5 h-5" />
        </span>
        Lokalizacja i kontakt
      </h2>
      
      {/* Mapa z ulepszoną stylizacją */}
      <div className="relative rounded-xl overflow-hidden mb-5 border-2 border-green-100 shadow-md transform hover:scale-[1.01] transition-transform duration-300">
        <div className="absolute top-3 left-3 z-10 bg-white px-3 py-1.5 rounded-full shadow-md text-sm font-semibold flex items-center border border-gray-100">
          <MapPin className="w-4 h-4 text-green-600 mr-1.5" />
          <span>{listing?.city || "Nieznane miasto"}, {listing?.voivodeship || "Nieznany region"}</span>
        </div>
        
        <iframe
          title="Mapa lokalizacji"
          width="100%"
          height="240"
          loading="lazy"
          style={{ border: 0 }}
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            (listing?.city || "") + "," + (listing?.voivodeship || "Polska")
          )}&output=embed`}
          className="hover:opacity-95 transition-opacity"
        />
        
        <a 
          href={`https://www.google.com/maps?q=${encodeURIComponent(
            (listing?.city || "") + "," + (listing?.voivodeship || "Nieznany region")
          )}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-full shadow-md text-sm font-medium text-green-600 hover:bg-green-50 transition-all duration-300 border border-gray-100 flex items-center"
        >
          <Eye className="w-4 h-4 mr-1.5" />
          Pokaż większą mapę
        </a>
      </div>
      
      {/* Dodatkowe informacje o lokalizacji */}
      <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-xl mb-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 p-1.5 rounded-full shadow-sm">
              <Info className="w-4 h-4" />
            </span>
            <span className="font-semibold text-gray-800">Dokładna lokalizacja</span>
          </div>
          <span className="text-sm text-gray-600 bg-white px-2.5 py-1 rounded-full shadow-sm border border-gray-100">
            {listing?.distance ? `${listing.distance} km od centrum` : "Centrum miasta"}
          </span>
        </div>
        
        {listing?.district && (
          <div className="text-sm text-gray-700 ml-9 mt-1.5 bg-white p-2 rounded-lg shadow-sm border border-gray-100 inline-block">
            Dzielnica: <span className="font-semibold text-gray-800">{listing.district}</span>
          </div>
        )}
      </div>

      {/* Przycisk pokaz dane */}
      {!showDetails ? (
        <button
          onClick={() => setShowDetails(true)}
          className="w-full flex items-center justify-center gap-2 bg-[#35530A] text-white py-3.5 px-4 hover:bg-[#2A4208] transition-colors text-lg rounded-xl mb-5 font-medium shadow-md"
        >
          <Phone className="w-5 h-5" />
          <span>Pokaż dane kontaktowe</span>
        </button>
      ) : (
        <div
          className="animate-fade-in mb-5"
        >
          <button
            onClick={() => setShowDetails(false)}
            className="w-full flex items-center justify-center gap-2 bg-[#35530A] text-white py-3.5 px-4 hover:bg-[#2A4208] transition-colors text-lg rounded-xl mb-5 font-medium shadow-md"
          >
            <Phone className="w-5 h-5" />
            <span>Ukryj dane kontaktowe</span>
          </button>
          
          <div className="bg-[#f8fbf5] p-4 rounded-xl border border-[#e9f5e1] shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-[#e9f5e1] rounded-full w-14 h-14 flex items-center justify-center text-[#35530A] font-bold text-xl border border-[#cbe3c0] shadow-md">
                {listing?.ownerName ? listing.ownerName[0].toUpperCase() : "?"}
              </div>
              <div>
                <div className="text-lg text-gray-800 font-semibold">
                  {listing?.ownerName || "Nieznane imię"}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="bg-[#e9f5e1] text-[#35530A] px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    {listing?.sellerType === "company" ? "Firma" : "Osoba prywatna"}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center bg-white px-2 py-1 rounded-full shadow-sm border border-gray-100">
                    <Clock className="w-3 h-3 mr-1" />
                    Dodano: {formatDate(listing?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Ocena sprzedającego - wyświetlana tylko gdy jest dostępna */}
            {listing?.rating && listing.rating > 0 && listing.reviewsCount > 0 && (
              <div className="mb-4 bg-white p-4 rounded-xl border border-[#e9f5e1] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Ocena sprzedającego:</span>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.round(listing.rating) ? 'text-yellow-400' : 'text-gray-200'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1.5 text-sm font-medium text-gray-700">
                      {listing.rating}/5
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Na podstawie {listing.reviewsCount} opinii
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <PhoneSection listing={listing} />
            </div>
            <div>
              <MessageButton listing={listing} />
            </div>
          </div>
        </div>
      )}
      
      {/* Ikony social i ulubione */}
      <div className="grid grid-cols-3 gap-3 mt-4 mb-4">
        <button
          onClick={() => handleShare("facebook")}
          className="flex flex-col items-center justify-center hover:bg-gray-50 rounded-xl transition-all duration-300 p-3 border border-gray-100 shadow-sm hover:shadow-md"
          title="Udostępnij na Facebooku"
        >
          <Facebook className="w-6 h-6 text-blue-600" />
          <span className="text-xs mt-1.5 text-gray-600">Facebook</span>
        </button>
        <button
          onClick={() => handleShare("gmail")}
          className="flex flex-col items-center justify-center hover:bg-gray-50 rounded-xl transition-all duration-300 p-3 border border-gray-100 shadow-sm hover:shadow-md"
          title="Udostępnij przez Gmail"
        >
          <GmailIcon />
          <span className="text-xs mt-1.5 text-gray-600">Email</span>
        </button>
        <button
          onClick={() => handleShare("whatsapp")}
          className="flex flex-col items-center justify-center hover:bg-gray-50 rounded-xl transition-all duration-300 p-3 border border-gray-100 shadow-sm hover:shadow-md"
          title="Udostępnij przez WhatsApp"
        >
          <WhatsAppIcon />
          <span className="text-xs mt-1.5 text-gray-600">WhatsApp</span>
        </button>
      </div>
      
      <button
        onClick={handleToggleFavorite}
        className="w-full flex items-center justify-center gap-2 bg-white py-3.5 px-4 hover:bg-gray-50 transition-all duration-300 border border-gray-200 shadow-md text-lg rounded-xl transform hover:scale-[1.01]"
      >
        <Heart
          className={`w-6 h-6 ${
            isFavorite ? "text-red-500 fill-red-500" : "text-gray-700"
          }`}
        />
        {isFavorite ? "W ulubionych" : "Dodaj do ulubionych"}
      </button>
      
      {/* Animacja fade-in */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in {
            animation: fadeIn 0.4s;
          }
        `}
      </style>
    </div>
  );
};

export default ContactInfo;