import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Eye,
  Mail,
  FileText,
  Bell,
  History,
  PhoneCall,
  Settings as SettingsIcon,
  Sliders,
  ChevronRight,
  X,
} from "lucide-react";
import { useNotifications } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import useBreakpoint from "../../../utils/responsive/useBreakpoint";
import { useSidebar } from "./MainContentWrapper";

const NAV_ITEMS = [
  { id: "panel", name: "Panel", path: "/profil", icon: Eye },
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
  { id: "contact", name: "Kontakt", path: "/profil/contact", icon: PhoneCall },
  {
    id: "settings",
    name: "Ustawienia",
    path: "/profil/settings",
    icon: SettingsIcon,
  },
];

const PRIMARY_COLOR = "#35530A";

const MobileSidebar = () => {
  const location = useLocation();
  const breakpoint = useBreakpoint();
  const { unreadCount = { messages: 0, alerts: 0 } } = useNotifications() || {};
  const { isAdmin } = useAuth();
  const { isExpanded, setIsExpanded } = useSidebar();

  const isMobileOrTablet =
    breakpoint === "mobile" || breakpoint === "tablet";

  if (!isMobileOrTablet) return null;

  const getActiveTab = () => {
    const current = NAV_ITEMS.find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/")
    );
    return current ? current.id : null;
  };

  const activeTab = getActiveTab();

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const closeSidebar = () => setIsExpanded(false);

  return (
    <>
      {/* Przycisk otwierający – widoczny tylko, gdy sidebar jest zamknięty */}
      {!isExpanded && (
        <button
          onClick={toggleSidebar}
          className="fixed top-1/2 left-0 -translate-y-1/2 bg-[#5A7834] text-white p-3 rounded-r-lg shadow-lg z-50 hover:bg-[#4a6b2a] transition-all duration-200"
          aria-label="Otwórz menu"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Przyciemnienie tła */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-40 bg-[#5A7834] text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isExpanded ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Nagłówek */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Zamknij menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nawigacja */}
        <nav className="flex flex-col p-6 space-y-2 overflow-y-auto h-full pb-20">
          {isAdmin() && (
            <Link
              to="/admin"
              onClick={closeSidebar}
              className="flex items-center space-x-3 p-4 mb-4 border-b border-white/20 text-yellow-300 hover:text-yellow-200 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Sliders className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">Panel Administratora</span>
            </Link>
          )}

          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/20"
                    : "text-gray-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <item.icon className="w-6 h-6" />
                  {item.badgeKey && unreadCount[item.badgeKey] > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-[#5A7834] rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-xs font-bold px-1">
                      {unreadCount[item.badgeKey] > 99
                        ? "99+"
                        : unreadCount[item.badgeKey]}
                    </span>
                  )}
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;
