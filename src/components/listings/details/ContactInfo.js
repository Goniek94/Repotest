import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Heart } from 'lucide-react';

const ContactInfo = ({ listing }) => {
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${listing.title || `${listing.make} ${listing.model}`}&body=${url}`);
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Link został skopiowany do schowka!');
    }
  };

  // Komponent modalu wiadomości
  const MessageModal = () => {
    if (!showMessageModal) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setShowMessageModal(false)}
        />
        <div className="relative bg-white p-6 w-full max-w-md mx-4 rounded-sm">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Napisz wiadomość
          </h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Temat"
              className="w-full p-3 border border-gray-200 rounded-sm focus:ring-2 focus:ring-black focus:outline-none text-lg"
            />
            <textarea
              placeholder="Treść wiadomości"
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-sm focus:ring-2 focus:ring-black focus:outline-none resize-none text-lg"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-black text-white py-3 rounded-sm hover:bg-gray-800 transition-colors text-lg"
              >
                Wyślij
              </button>
              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-sm hover:bg-gray-200 transition-colors text-lg"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-sm">
      <h2 className="text-lg font-bold mb-4 text-black">
        Lokalizacja i kontakt
      </h2>
      <div className="rounded-sm overflow-hidden mb-6">
        <iframe
          title="Mapa lokalizacji"
          width="100%"
          height="200"
          loading="lazy"
          style={{ border: 0 }}
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            (listing.city || '') + ',' + (listing.voivodeship || 'Polska')
          )}&output=embed`}
        />
      </div>

      <div className="space-y-3">
        <div className="text-gray-700 text-lg flex items-center justify-center gap-2">
          <MapPin className="w-6 h-6" />
          <span>
            {listing.city || 'Nieznane miasto'}, {listing.voivodeship || 'Nieznany region'}
          </span>
        </div>
        <button
          onClick={() => setShowPhoneNumber(!showPhoneNumber)}
          className="w-full flex items-center justify-center gap-2 bg-[#35530A] text-white py-3 px-4 hover:bg-[#2A4208] transition-colors text-lg rounded-sm"
        >
          <Phone className="w-6 h-6" />
          {showPhoneNumber ? (listing.contact?.phone || '+48 123 456 789') : 'Pokaż numer'}
        </button>
        <button
          onClick={() => setShowMessageModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 hover:bg-gray-200 transition-colors text-lg rounded-sm"
        >
          <Mail className="w-6 h-6" />
          Napisz wiadomość
        </button>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-center gap-6 mb-4">
            <button
              onClick={() => handleShare('facebook')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Udostępnij na Facebooku"
            >
              <Facebook className="w-7 h-7 text-black" />
            </button>
          </div>
          <button
            onClick={handleToggleFavorite}
            className="w-full flex items-center justify-center gap-2 text-gray-700 py-3 px-4 hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm text-lg rounded-sm"
          >
            <Heart
              className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-black'}`}
            />
            {isFavorite ? 'W ulubionych' : 'Dodaj do ulubionych'}
          </button>
        </div>
      </div>

      {/* Modal wiadomości */}
      <MessageModal />
    </div>
  );
};

export default ContactInfo;