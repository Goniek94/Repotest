import React, { useState } from 'react';
import { Bell, Mail, Eye, User, FileText, History, Settings, Star, Trash2, Search, Filter } from 'lucide-react';

// Główny kolor
const PRIMARY_COLOR = '#35530A';

const MessagesPage = () => {
  const [activeTab, setActiveTab] = useState('odebrane');
  
  // Przykładowe wiadomości
  const messages = [
    {
      id: 1,
      from: 'jan.kowalski@example.com',
      subject: 'Witam serdecznie',
      content: 'Treść wiadomości testowej',
      date: '29.04.2025'
    },
    {
      id: 2,
      from: 'anna.nowak@example.com',
      subject: 'Odpowiedź na ogłoszenie',
      content: 'Jestem zainteresowany Twoim ogłoszeniem.',
      date: '29.04.2025'
    }
  ];
  
  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      {/* Tytuł strony */}
      <div className="border-b border-gray-300 pb-4 mb-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 pt-4">Wiadomości</h1>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          {/* Menu boczne - widoczne tylko na większych ekranach */}
          <div className="hidden md:block w-64 mr-8">
            <div className="bg-white rounded-sm shadow-sm mb-6">
              <div className="p-4 border-b border-gray-100">
                <a href="#" className="flex items-center text-gray-700 font-medium">
                  <User className="w-5 h-5 mr-3 text-gray-500" />
                  Panel Główny
                </a>
              </div>
              
              <div className="p-4 border-b border-gray-100 bg-green-50">
                <a href="#" className="flex items-center justify-between text-[#35530A] font-medium">
                  <span className="flex items-center">
                    <Mail className="w-5 h-5 mr-3" />
                    Wiadomości
                  </span>
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    5
                  </span>
                </a>
              </div>
              
              <div className="p-4 border-b border-gray-100">
                <a href="#" className="flex items-center justify-between text-gray-700 font-medium">
                  <span className="flex items-center">
                    <Bell className="w-5 h-5 mr-3 text-gray-500" />
                    Powiadomienia
                  </span>
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    1
                  </span>
                </a>
              </div>
              
              <div className="p-4 border-b border-gray-100">
                <a href="#" className="flex items-center text-gray-700 font-medium">
                  <History className="w-5 h-5 mr-3 text-gray-500" />
                  Historia Transakcji
                </a>
              </div>
              
              <div className="p-4 border-b border-gray-100">
                <a href="#" className="flex items-center text-gray-700 font-medium">
                  <FileText className="w-5 h-5 mr-3 text-gray-500" />
                  Moje Ogłoszenia
                </a>
              </div>
              
              <div className="p-4">
                <a href="#" className="flex items-center text-gray-700 font-medium">
                  <Settings className="w-5 h-5 mr-3 text-gray-500" />
                  Ustawienia
                </a>
              </div>
            </div>
          </div>
          
          {/* Panel główny */}
          <div className="flex-grow">
            <div className="bg-white rounded-sm shadow-sm">
              {/* Nagłówek wiadomości */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Wiadomości</h2>
                
                <button className="bg-green-600 text-white px-4 py-2 rounded-sm text-sm font-medium">
                  Nowa wiadomość
                </button>
              </div>
              
              {/* Zakładki */}
              <div className="flex border-b border-gray-200">
                <button 
                  className={`py-3 px-6 font-medium text-sm ${activeTab === 'odebrane' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('odebrane')}
                >
                  Odebrane
                </button>
                <button 
                  className={`py-3 px-6 font-medium text-sm ${activeTab === 'wysłane' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('wysłane')}
                >
                  Wysłane
                </button>
                <button 
                  className={`py-3 px-6 font-medium text-sm ${activeTab === 'robocze' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('robocze')}
                >
                  Robocze
                </button>
                <button 
                  className={`py-3 px-6 font-medium text-sm ${activeTab === 'archiwum' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('archiwum')}
                >
                  Archiwum
                </button>
              </div>
              
              {/* Lista wiadomości */}
              <div className="divide-y divide-gray-100">
                {messages.map(message => (
                  <div key={message.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">Od: {message.from}</div>
                      <div className="text-sm text-gray-500">{message.date}</div>
                    </div>
                    <div className="font-bold mb-1">{message.subject}</div>
                    <div className="text-sm text-gray-600">{message.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;