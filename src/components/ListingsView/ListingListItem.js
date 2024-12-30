import React, { useState } from 'react';
import { FaHeart, FaMapMarkerAlt } from 'react-icons/fa';

const CardLayout = () => {
 const [favorites, setFavorites] = useState([]);
 const [showToast, setShowToast] = useState(false);
 const [toastMessage, setToastMessage] = useState('');

 const listings = [
   {
     id: 1,
     title: 'VW Golf 7 1.4 TSI',
     subtitle: '(dane z tabelek), (+ krótki opis sprzedającego + nagłówka, max 60 znaków)',
     price: '50 000 zł',
     fuel: 'Benzyna',
     engineCapacity: '1398 cm³',
     power: '122 KM',
     mileage: '150 000 km',
     year: '2015',
     location: 'Mazowieckie',
     city: 'Warszawa',
     transmission: 'Manual',
     drive: 'Napęd przedni',
     image: '/images/automobile-1834278_640.jpg',
     featured: true
   },
   {
     id: 2,
     title: 'BMW 3 E36 1.8 is',
     subtitle: '(dane z tabelek), (+ krótki opis sprzedającego + nagłówka, max 60 znaków)',
     price: '30 000 zł',
     fuel: 'Benzyna',
     engineCapacity: '1802 cm³',
     power: '140 KM',
     mileage: '223 565 km',
     year: '1993',
     location: 'Mazowieckie',
     city: 'Warszawa',
     transmission: 'Manual',
     drive: 'Napęd tylny',
     image: '/images/car-1880381_640.jpg',
     featured: false
   },
 ];

 // Sortowanie - wyróżnione na początek
 const sortedListings = [...listings].sort((a, b) => {
   if (a.featured && !b.featured) return -1;
   if (!a.featured && b.featured) return 1;
   return 0;
 });

 const toggleFavorite = (id) => {
   const isFavorite = favorites.includes(id);
   setFavorites((prev) =>
     prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
   );

   setToastMessage(isFavorite ? 'Usunięto z ulubionych' : 'Dodano do ulubionych');
   setShowToast(true);
   setTimeout(() => setShowToast(false), 2000);
 };

 const navigateToListing = (id) => {
   console.log(`Przejdź do szczegółów ogłoszenia o ID: ${id}`);
   window.location.href = `/listing/${id}`;
 };

 return (
   <div className="max-w-7xl mx-auto px-4">
     <div className="space-y-4">
       {sortedListings.map((listing) => (
         <div
           key={listing.id}
           className={`bg-white shadow-md rounded-sm flex overflow-hidden hover:bg-gray-50 cursor-pointer relative ${
             listing.featured ? 'border-2 border-green-500' : ''
           }`}
           onClick={() => navigateToListing(listing.id)}
         >
           {/* Obrazek z plakietką WYRÓŻNIONE */}
           <div className="w-48 h-32 flex-shrink-0 relative">
             <img
               src={listing.image}
               alt={listing.title}
               className="w-full h-full object-cover"
             />
             {listing.featured && (
               <div className="absolute top-2 left-0 bg-green-500 text-white px-2 py-1 text-sm">
                 WYRÓŻNIONE
               </div>
             )}
           </div>

           {/* Toast notification */}
           {showToast && (
             <div className="absolute top-2 right-16 bg-black bg-opacity-75 text-white px-3 py-1 rounded-sm text-sm z-10">
               {toastMessage}
             </div>
           )}

           {/* Szczegóły */}
           <div className="flex-grow px-4 py-4">
             <div className="font-medium text-xl">{listing.title}</div>
             <div className="text-base text-gray-600 mt-2">{listing.subtitle}</div>
             <div className="flex items-center space-x-2 mt-4 text-gray-800 text-sm">
               <span>{listing.fuel}</span>
               <span className="border-l border-gray-300 px-2">{listing.engineCapacity}</span>
               <span className="border-l border-gray-300 px-2">{listing.power}</span>
               <span className="border-l border-gray-300 px-2">{listing.mileage}</span>
               <span className="border-l border-gray-300 px-2">{listing.year}</span>
               <span className="border-l border-gray-300 px-2">{listing.drive}</span>
             </div>
           </div>

           {/* Lokalizacja i Cena */}
           <div className="flex flex-col items-center justify-center px-6 border-l">
             <div className="text-lg text-gray-700 flex items-center mb-4">
               <FaMapMarkerAlt className="mr-2 text-red-500" />
               {listing.city}, {listing.location}
             </div>
             <div className="flex items-center justify-center border-t pt-2">
               <span className="text-3xl text-gray-900 font-semibold">
                 {listing.price}
               </span>
             </div>
           </div>

           {/* Serduszko z tooltipem */}
           <div
             className="flex items-center justify-center px-6 border-l cursor-pointer relative group"
             onClick={(e) => {
               e.stopPropagation();
               toggleFavorite(listing.id);
             }}
           >
             <div className="relative">
               <FaHeart
                 className={`text-3xl ${
                   favorites.includes(listing.id) ? 'text-red-500' : 'text-gray-300'
                 }`}
               />
               <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded mb-1 whitespace-nowrap">
                 {favorites.includes(listing.id) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
               </div>
             </div>
           </div>
         </div>
       ))}
     </div>
   </div>
 );
};

export default CardLayout;