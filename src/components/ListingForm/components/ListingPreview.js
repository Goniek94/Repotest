import React from 'react';
import { MapPin, Medal } from 'lucide-react';
import ImageGallery from '../../listings/details/ImageGallery';
import TechnicalDetails from '../../listings/details/TechnicalDetails';
import Description from '../../listings/details/Description';

const ListingPreview = ({ listingData, listingType }) => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Premium listing badge */}
      {listingType === 'wyróżnione' && (
        <div className="mb-4 flex justify-center">
          <div className="bg-[#35530A] text-white px-4 py-2 text-sm rounded-[2px] font-medium flex items-center gap-2">
            <Medal className="w-4 h-4" />
            PODGLĄD OGŁOSZENIA WYRÓŻNIONEGO
          </div>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column: gallery, headline, description */}
        <div className="w-full lg:w-[60%] space-y-8">
          {/* Image gallery */}
          <ImageGallery 
            images={(() => {
              // Prepare image array for ImageGallery component
              if (listingData.photos && listingData.photos.length > 0) {
                return listingData.photos.map(photo => photo.src || photo.url || photo);
              }
              if (listingData.images && listingData.images.length > 0) {
                return listingData.images.map(img => img.url || img.src || img);
              }
              if (listingData.mainImage) {
                return [listingData.mainImage];
              }
              return [];
            })()} 
          />

          {/* Listing headline - if exists */}
          {listingData.headline && (
            <div className="bg-white p-6 shadow-md rounded-sm">
              <h2 className="text-xl font-bold mb-4 text-black">
                Nagłówek ogłoszenia
              </h2>
              <div className="bg-gray-50 p-4 rounded-md border-l-4 border-[#35530A]">
                <p className="text-lg font-medium text-gray-800">
                  {listingData.headline}
                </p>
              </div>
            </div>
          )}
          
          {/* Description */}
          <Description description={listingData.description || 'Brak opisu'} />
        </div>
        
        {/* Right column: technical details, contact */}
        <div className="w-full lg:w-[40%] space-y-8">
          {/* Technical details */}
          <TechnicalDetails listing={listingData} />
          
          {/* Contact information - preview version without contact functionality */}
          <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center border-b border-gray-100 pb-3">
              <span className="bg-gradient-to-r from-green-600 to-green-400 text-white p-2 rounded-full mr-3 shadow-md">
                <MapPin className="w-5 h-5" />
              </span>
              Lokalizacja
            </h2>
            
            {/* Location map */}
            <div className="relative rounded-xl overflow-hidden mb-5 border-2 border-green-100 shadow-md">
              <div className="absolute top-3 left-3 z-10 bg-white px-3 py-1.5 rounded-full shadow-md text-sm font-semibold flex items-center border border-gray-100">
                <MapPin className="w-4 h-4 text-green-600 mr-1.5" />
                <span>{listingData.city || "Nieznane miasto"}, {listingData.voivodeship || "Nieznany region"}</span>
              </div>
              
              <iframe
                title="Mapa lokalizacji"
                width="100%"
                height="240"
                loading="lazy"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  (listingData.city || "") + "," + (listingData.voivodeship || "Polska")
                )}&output=embed`}
                className="hover:opacity-95 transition-opacity"
              />
            </div>
            
            {/* Preview information */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">To jest podgląd ogłoszenia</span>
              </div>
              <p className="text-sm text-blue-600 mt-2">
                Dane kontaktowe będą widoczne po opublikowaniu ogłoszenia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPreview;
