import React from 'react';
import { User, MapPin } from 'lucide-react';

const SellerInfoCard = ({ sellerType, location, voivodeship }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-sm border border-gray-200">
      <div className="space-y-3">
        {/* Sprzedawca */}
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          <div>
            <div className="text-sm text-gray-500">Sprzedawca</div>
            <div className="text-base font-medium">{sellerType || 'Firma'}</div>
          </div>
        </div>
        
        {/* Lokalizacja */}
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-600" />
          <div>
            <div className="text-sm text-gray-500">Lokalizacja</div>
            <div className="text-base font-medium">
              {location || 'Kraków'}
              {voivodeship && <span className="text-gray-500"> ({voivodeship})</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInfoCard;
