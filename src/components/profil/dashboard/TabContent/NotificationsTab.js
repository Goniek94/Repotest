import React from 'react';
import { BellRing, Car, MessageSquare, Tag, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';

// Główny kolor aplikacji
const PRIMARY_COLOR = '#35530A';

/**
 * Komponent wyświetlający powiadomienia użytkownika
 */
const NotificationsTab = () => {
  // Przykładowe dane powiadomień
  const notifications = [
    { 
      id: 1, 
      type: 'message', 
      title: 'Nowa wiadomość', 
      description: 'Jan Kowalski napisał do Ciebie w sprawie BMW X5', 
      date: '1 godzina temu',
      read: false,
      icon: <MessageSquare size={16} className="text-blue-500" />
    },
    { 
      id: 2, 
      type: 'price', 
      title: 'Obniżka ceny', 
      description: 'Cena oglądanego przez Ciebie Audi A4 została obniżona o 5000 zł', 
      date: '5 godzin temu',
      read: false,
      icon: <Tag size={16} className="text-green-500" />
    },
    { 
      id: 3, 
      type: 'transaction', 
      title: 'Transakcja zakończona', 
      description: 'Twoja transakcja zakupu Volkswagen Golf została zakończona pomyślnie', 
      date: '2 dni temu',
      read: true,
      icon: <ShoppingCart size={16} className="text-purple-500" />
    },
    { 
      id: 4, 
      type: 'listing', 
      title: 'Ogłoszenie zaakceptowane', 
      description: 'Twoje ogłoszenie BMW X5 zostało zaakceptowane i jest już widoczne', 
      date: '3 dni temu',
      read: true,
      icon: <CheckCircle size={16} className="text-green-500" />
    },
    { 
      id: 5, 
      type: 'alert', 
      title: 'Ważna informacja', 
      description: 'Twoje ogłoszenie Audi A3 wygaśnie za 2 dni. Rozważ jego przedłużenie.', 
      date: '5 dni temu',
      read: true,
      icon: <AlertCircle size={16} className="text-amber-500" />
    }
  ];

  return (
    <div>
      {/* Nagłówek z gradientem */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white p-3 flex items-center">
        <BellRing className="w-5 h-5 mr-2" />
        <h2 className="text-lg font-medium">Ostatnia aktywność</h2>
      </div>
      
      {/* Lista powiadomień */}
      {notifications.length > 0 ? (
        <div className="bg-white">
          {notifications.map((notification) => {
            // Określenie koloru paska bocznego w zależności od typu powiadomienia
            const isUrgent = notification.type === 'alert';
            const borderColor = isUrgent ? 'border-red-500' : 'border-green-600';
            const bgColor = isUrgent ? 'bg-red-50' : 'bg-white';
            
            return (
              <div 
                key={notification.id} 
                className={`flex items-start relative ${bgColor} border-b border-gray-100 ${
                  !notification.read ? 'border-l-4 ' + borderColor : ''
                }`}
              >
                {/* Kolorowy pasek po lewej (widoczny zawsze, ale bardziej wyraźny dla nieprzeczytanych) */}
                {notification.read && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-opacity-50 ${isUrgent ? 'bg-red-200' : 'bg-green-200'}`}></div>}
                
                <div className="flex-1 p-3 ml-1">
                  <div className="flex">
                    {/* Ikona */}
                    <div className="mr-3 mt-0.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isUrgent ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'
                      }`}>
                        {notification.icon}
                      </div>
                    </div>
                    
                    {/* Treść powiadomienia */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold text-gray-800">
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2">{notification.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{notification.description}</p>
                    </div>
                    
                    {/* Przycisk odpowiedzi */}
                    <div className="ml-4">
                      <button className="text-green-700 hover:text-green-800 text-xs font-semibold bg-transparent">
                        Odpowiedź →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-white border-t border-b border-gray-100">
          <BellRing size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">Brak nowych powiadomień</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;