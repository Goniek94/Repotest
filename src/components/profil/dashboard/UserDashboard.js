import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Bell, 
  Clock, 
  Settings, 
  User,
  FileText,
  Plus 
} from 'lucide-react';

const UserDashboard = () => {
  const location = useLocation();
  const user = { name: 'Jan' }; // To powinno być pobierane z kontekstu
  
  // Dane dla interfejsu
  const notifications = {
    messages: 5,
    alerts: 3
  };
  
  const activityItems = [
    {
      type: 'message',
      content: 'Nowa wiadomość od użytkownika',
      time: '2 godz. temu',
      action: 'Odpowiedz',
      actionLink: '/profil/messages'
    },
    {
      type: 'listing',
      content: 'Dodano nowe ogłoszenie',
      time: 'wczoraj',
      action: 'Zobacz',
      actionLink: '/profil/listings'
    }
  ];

  // Menu boczne
  const menuItems = [
    {
      title: "Panel Główny",
      path: "/profil",
      icon: <User size={18} />,
      exact: true
    },
    {
      title: "Wiadomości",
      path: "/profil/messages",
      icon: <MessageSquare size={18} />,
      badge: notifications.messages
    },
    {
      title: "Powiadomienia",
      path: "/profil/notifications",
      icon: <Bell size={18} />,
      badge: notifications.alerts
    },
    {
      title: "Historia Transakcji",
      path: "/profil/transactions",
      icon: <Clock size={18} />
    },
    {
      title: "Moje Ogłoszenia",
      path: "/profil/listings",
      icon: <FileText size={18} />
    },
    {
      title: "Ustawienia",
      path: "/profil/settings",
      icon: <Settings size={18} />
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Menu boczne */}
      <div className="w-56 bg-white shadow-sm">
        <div className="p-5 border-b">
          <h1 className="text-lg font-semibold text-[#35530A]">Panel Użytkownika</h1>
        </div>
        
        <nav className="p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded transition-colors ${
                    isActive(item.path, item.exact)
                      ? 'bg-[#35530A] text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Zawartość główna */}
      <div className="flex-1 p-6">
        {/* Nagłówek z powitaniem */}
        <div className="bg-white p-6 rounded shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#e9f0dd] rounded-full flex items-center justify-center text-[#35530A] font-bold">
              JK
            </div>
            <div>
              <h2 className="text-xl font-semibold">Witaj, {user.name}!</h2>
              <p className="text-gray-500 text-sm">Ostatnie logowanie: dziś, 12:30</p>
            </div>
          </div>
        </div>
        
        {/* Karty szybkich akcji */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Dodaj ogłoszenie */}
          <div className="bg-white p-6 rounded shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#e9f0dd] rounded-full flex items-center justify-center text-[#35530A]">
                <Plus size={18} />
              </div>
              <h3 className="font-semibold">Dodaj ogłoszenie</h3>
            </div>
            <p className="text-gray-500 text-sm mb-3">Wystaw nowy pojazd</p>
            <Link to="/create-listing" className="text-[#35530A] hover:underline text-sm">
              Dodaj ogłoszenie →
            </Link>
          </div>
          
          {/* Wiadomości */}
          <div className="bg-white p-6 rounded shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#e9f0dd] rounded-full flex items-center justify-center text-[#35530A]">
                <MessageSquare size={18} />
              </div>
              <h3 className="font-semibold">Wiadomości</h3>
            </div>
            <p className="text-gray-500 text-sm mb-3">5 nieprzeczytanych</p>
            <Link to="/profil/messages" className="text-[#35530A] hover:underline text-sm">
              Zobacz wiadomości →
            </Link>
          </div>
          
          {/* Powiadomienia */}
          <div className="bg-white p-6 rounded shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#e9f0dd] rounded-full flex items-center justify-center text-[#35530A]">
                <Bell size={18} />
              </div>
              <h3 className="font-semibold">Powiadomienia</h3>
            </div>
            <p className="text-gray-500 text-sm mb-3">3 nowe</p>
            <Link to="/profil/notifications" className="text-[#35530A] hover:underline text-sm">
              Zobacz powiadomienia →
            </Link>
          </div>
        </div>
        
        {/* Ostatnia aktywność */}
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="font-semibold mb-4">Ostatnia aktywność</h3>
          <div className="space-y-4">
            {activityItems.map((item, index) => (
              <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                <h4 className="font-medium">{item.content}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-500 text-sm">{item.time}</span>
                  <Link to={item.actionLink} className="text-blue-500 hover:underline text-sm">
                    {item.action} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;