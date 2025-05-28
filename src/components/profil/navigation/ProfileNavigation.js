// ProfileNavigation.js
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, Mail, FileText, Bell, History, PhoneCall, LogOut, Settings as SettingsIcon } from "lucide-react";

// Central config for all profile navigation
const NAV_ITEMS = [
  {
    id: "panel",
    name: "Panel",
    path: "/profil",
    icon: Eye,
  },
  {
    id: "messages",
    name: "Wiadomości",
    path: "/profil/messages",
    icon: Mail,
    badgeKey: "messages",
  },
  {
    id: "listings",
    name: "Moje ogłoszenia",
    path: "/profil/listings",
    icon: FileText,
  },
  {
    id: "notifications",
    name: "Powiadomienia",
    path: "/profil/notifications",
    icon: Bell,
    badgeKey: "alerts",
  },
  {
    id: "transactions",
    name: "Historia Transakcji",
    path: "/profil/transactions",
    icon: History,
  },
  {
    id: "contact",
    name: "Kontakt",
    path: "/profil/contact",
    icon: PhoneCall,
  },
  {
    id: "settings",
    name: "Ustawienia",
    path: "/profil/settings",
    icon: SettingsIcon,
  },
];

const PRIMARY_COLOR = "#35530A";

// notifications = { messages: number, alerts: number }
export default function ProfileNavigation({
  notifications = { messages: 0, alerts: 0 },
  handleLogout,
  isDropdown = false,
  isOpen,
  setIsOpen,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab by current path
  const getActiveTab = () => {
    const current = NAV_ITEMS.find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/")
    );
    return current ? current.id : null;
  };
  const activeTab = getActiveTab();

  // Dropdown menu (for "MÓJ PROFIL" button)
  if (isDropdown) {
    return (
      <div className="relative user-menu">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen && setIsOpen(!isOpen);
          }}
          className="px-4 py-2 font-bold uppercase rounded-[2px] hover:bg-gray-100 transition-colors relative flex items-center gap-2 text-gray-800 text-sm lg:text-base xl:text-lg"
        >
          Mój Profil
          {(notifications.messages + notifications.alerts > 0) && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.messages + notifications.alerts}
            </div>
          )}
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-[2px] shadow-xl z-50 border border-gray-200">
            <div className="py-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 uppercase font-bold transition ${
                    activeTab === item.id
                      ? "text-[#35530A] font-bold border-b-2 border-[#35530A] bg-[#F3F4F6]"
                      : ""
                  } flex items-center gap-2`}
                  onClick={() => setIsOpen && setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                  {item.badgeKey && notifications[item.badgeKey] > 0 && (
                    <span
                      className="ml-1 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                      {notifications[item.badgeKey]}
                    </span>
                  )}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 uppercase flex items-center gap-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Wyloguj się
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Horizontal tab navigation (for profile dashboard)
  return (
    <div className="w-full border-b border-gray-200 mb-6 bg-white relative">
      <div className="flex overflow-x-auto no-scrollbar">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`whitespace-nowrap py-3 px-4 md:px-5 flex items-center transition-colors ${
              activeTab === item.id
                ? "border-b-3 text-[#35530A] border-[#35530A] font-medium bg-[#f5f8f0] -mb-[1px]"
                : "text-gray-600 hover:text-green-800 hover:border-b-2 hover:border-gray-300"
            }`}
          >
            <item.icon className="w-4 h-4 mr-2" />
            {item.name}
            {item.badgeKey && notifications[item.badgeKey] > 0 && (
              <span
                className="ml-1 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                {notifications[item.badgeKey]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
