import React from 'react';
import { FiHeart, FiMessageSquare, FiEye } from 'react-icons/fi';

const Favorites = () => {
  const favorites = [
    {
      id: 1,
      title: 'Mercedes-AMG GT 63 S',
      price: 750000,
      location: 'Warszawa',
      year: 2023,
      mileage: 15000,
      image: '/api/placeholder/200/150',
      saved: '2024-01-15'
    },
    {
      id: 2,
      title: 'Porsche 911 GT3',
      price: 980000,
      location: 'Kraków',
      year: 2022,
      mileage: 8000,
      image: '/api/placeholder/200/150',
      saved: '2024-01-14'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">ULUBIONE OGŁOSZENIA</h2>

      <div className="grid grid-cols-1 gap-4">
        {favorites.map(car => (
          <div key={car.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex p-4">
              <img 
                src={car.image} 
                alt={car.title} 
                className="w-48 h-36 object-cover rounded"
              />
              <div className="flex-1 ml-4">
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold hover:text-green-600">
                    {car.title}
                  </h3>
                  <button className="text-red-500 hover:text-red-600">
                    <FiHeart size={24} fill="currentColor" />
                  </button>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {car.price.toLocaleString()} PLN
                </p>
                <div className="mt-2 text-gray-600">
                  <p>{car.year} • {car.mileage.toLocaleString()} km • {car.location}</p>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button className="flex items-center text-blue-600 hover:text-blue-700">
                    <FiMessageSquare className="mr-2" />
                    Wyślij wiadomość
                  </button>
                  <div className="flex items-center text-gray-500">
                    <FiEye className="mr-1" />
                    <span className="text-sm">123 wyświetleń</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;