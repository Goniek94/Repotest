import React from 'react';
import { Medal } from 'lucide-react';

const ListingTypeSelector = ({ listingType, setListingType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className={`
          relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md
          ${listingType === 'standardowe' 
            ? 'border-[#35530A] bg-green-50 shadow-md' 
            : 'border-gray-200 hover:border-gray-300'
          }
        `}>
          <input
            type="radio"
            name="listingType"
            value="standardowe"
            checked={listingType === 'standardowe'}
            onChange={(e) => setListingType(e.target.value)}
            className="sr-only"
          />
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-gray-800">Ogłoszenie standardowe</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Podstawowa widoczność ogłoszenia</p>
              <div className="text-2xl font-bold text-[#35530A]">30 zł</div>
              <div className="text-sm text-gray-500">30 dni</div>
            </div>
          </div>
        </label>

        <label className={`
          relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md
          ${listingType === 'wyróżnione' 
            ? 'border-[#35530A] bg-green-50 shadow-md' 
            : 'border-gray-200 hover:border-gray-300'
          }
        `}>
          <input
            type="radio"
            name="listingType"
            value="wyróżnione"
            checked={listingType === 'wyróżnione'}
            onChange={(e) => setListingType(e.target.value)}
            className="sr-only"
          />
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-gray-800">Ogłoszenie wyróżnione</span>
                <Medal className="w-4 h-4 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600 mb-3">Zwiększona widoczność i wyróżnienie</p>
              <div className="text-2xl font-bold text-[#35530A]">50 zł</div>
              <div className="text-sm text-gray-500">30 dni</div>
            </div>
          </div>
        </label>
    </div>
  );
};

export default ListingTypeSelector;
