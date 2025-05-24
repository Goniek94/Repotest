import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

// Główny kolor
const PRIMARY_COLOR = '#35530A';
const PRIMARY_DARK = '#2A4208';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mainPhoto, setMainPhoto] = useState('/car-photo.jpg');
  const [formData, setFormData] = useState({
    price: '25000',
    city: 'Łowicz',
    region: 'Łódzkie',
    color: 'Biały',
    make: 'BMW',
    model: 'Seria 2',
    year: '2018',
    mileage: '78 500 km',
    fuel: 'benzyna',
    power: '125 KM',
    description: 'Super auto, polecam'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Pobieranie danych ogłoszenia na podstawie ID
  useEffect(() => {
    // W rzeczywistej aplikacji tutaj byłoby zapytanie do API
    // Przykład: api.getListing(id).then(data => setFormData(data))
    
    // Symulacja pobierania danych
    console.log(`Pobieranie danych ogłoszenia o ID: ${id}`);
    
    // Symulacja opóźnienia ładowania
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika zapisywania zmian
    console.log('Zapisywanie zmian dla ogłoszenia ID:', id);
    // Po zapisaniu przekieruj do listy ogłoszeń
    // navigate('/profil/listings');
  };
  
  const handleDelete = () => {
    // Logika usuwania ogłoszenia
    console.log('Usuwanie ogłoszenia ID:', id);
    // Po usunięciu przekieruj do listy ogłoszeń
    // navigate('/profil/listings');
  };
  
  return (
    <div className="bg-white min-h-screen pb-10">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Nagłówek z gradientem */}
        <div 
          className="w-full mb-6 p-6 text-white rounded-sm"
          style={{ 
            background: 'linear-gradient(to right, #2A4208, #35530A)',
            borderRadius: '2px'
          }}
        >
          <h1 className="text-2xl font-bold">Edycja ogłoszenia</h1>
          <p className="opacity-80 mt-1">ID ogłoszenia: {id}</p>
        </div>
        
        {/* Przycisk powrotu */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); navigate('/profil/listings'); }} 
          className="inline-flex items-center text-[#35530A] font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Powrót do moich ogłoszeń
        </a>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Sekcja zdjęć */}
            <div>
              <h2 className="text-lg font-bold mb-4">Zdjęcia (1/20)</h2>
              
              <div className="mb-4">
                <img 
                  src={mainPhoto} 
                  alt="Główne zdjęcie pojazdu" 
                  className="w-full h-48 md:h-64 object-cover border border-gray-200 rounded-sm"
                />
              </div>
              
              <p className="text-sm text-gray-700 mb-3">Kliknij na zdjęcie, aby ustawić je jako główne:</p>
              
              <div className="flex items-start space-x-2">
                <div className="w-20 h-20 border border-[#35530A] rounded-sm overflow-hidden">
                  <img 
                    src={mainPhoto} 
                    alt="Miniatura" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="w-20 h-20 border border-gray-200 rounded-sm flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100">
                  <div className="flex flex-col items-center text-gray-500">
                    <Plus className="w-4 h-4 mb-1" />
                    <span className="text-xs">Dodaj zdjęcie</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-lg font-bold mb-4">Opis</h2>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full h-32 p-3 border border-gray-300 rounded-sm"
                ></textarea>
              </div>
            </div>
            
            {/* Dane podstawowe */}
            <div>
              <h2 className="text-lg font-bold mb-4">Dane podstawowe</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cena (PLN)</label>
                  <input 
                    type="text" 
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Miasto</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Województwo</label>
                  <input 
                    type="text" 
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kolor</label>
                  <input 
                    type="text" 
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-sm"
                  />
                </div>
                
                <div>
                  <h3 className="text-base font-semibold mb-3 mt-6">Informacje o pojeździe</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marka:</label>
                      <input 
                        type="text" 
                        name="make"
                        value={formData.make}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model:</label>
                      <input 
                        type="text" 
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rok produkcji:</label>
                      <input 
                        type="text" 
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Przebieg:</label>
                      <input 
                        type="text" 
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Paliwo:</label>
                      <input 
                        type="text" 
                        name="fuel"
                        value={formData.fuel}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Moc:</label>
                      <input 
                        type="text" 
                        name="power"
                        value={formData.power}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-sm"
                      />
                    </div>
                  </div>
                  
                  <p className="text-xs text-blue-600 mt-3">
                    * Aby zmienić dane techniczne pojazdu, skontaktuj się z działem serwisu: pomoc@autosite.pl
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Przyciski akcji */}
          <div className="space-y-3 mt-8">
            <button 
              type="submit"
              className="w-full py-3 bg-[#35530A] text-white font-medium rounded-sm hover:bg-[#2A4208]"
            >
              Zapisz zmiany
            </button>
            
            <button 
              type="button"
              onClick={handleDelete}
              className="w-full py-3 bg-red-600 text-white font-medium rounded-sm hover:bg-red-700"
            >
              Usuń ogłoszenie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListing;