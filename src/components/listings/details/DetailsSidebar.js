import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Eye } from 'lucide-react';

const DetailsSidebar = ({ listing }) => {
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  const handleShare = (platform) => {
    const url = window.location.href;
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${listing.title}&body=${url}`);
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Link został skopiowany do schowka!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Dane techniczne */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Dane techniczne</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {Object.entries(listing?.details || {}).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">{key}</span>
              <span className="text-gray-800 font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Kontakt do sprzedającego */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Kontakt do sprzedającego</h2>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">
            {`${listing?.location?.city || 'Nieznane miasto'}, ${listing?.location?.region || 'Nieznany region'}`}
          </span>
        </div>

        {/* Przyciski akcji */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPhoneNumber(!showPhoneNumber)}
            className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Phone size={20} />
            {showPhoneNumber ? listing?.contact?.phone || 'Brak numeru' : 'Pokaż numer'}
          </button>
          <button
            onClick={() => handleShare('email')}
            className="flex items-center gap-2 bg-gray-100 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <Mail size={20} />
            Napisz e-mail
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="flex items-center gap-2 bg-gray-100 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <Facebook size={20} />
            Facebook
          </button>
        </div>

        {/* Licznik wyświetleń */}
        <div className="flex items-center justify-end text-gray-500 text-sm mt-6">
          <Eye className="w-5 h-5 mr-1" />
          Liczba wyświetleń: {listing?.viewCount || 0}
        </div>
      </div>
    </div>
  );
};

export default DetailsSidebar;
