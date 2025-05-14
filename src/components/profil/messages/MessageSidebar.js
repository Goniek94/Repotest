import React from 'react';
import { FaInbox, FaPaperPlane, FaStar, FaFolder, FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';

/**
 * Komponent bocznego menu z folderami wiadomości
 * @param {Object} props - Właściwości komponentu
 * @param {string} props.activeTab - Aktywna zakładka
 * @param {Function} props.onTabChange - Funkcja wywoływana przy zmianie zakładki
 * @param {Object} props.unreadCounts - Liczba nieprzeczytanych wiadomości w folderach
 * @returns {JSX.Element} - Komponent bocznego menu
 */
const MessageSidebar = ({ activeTab, onTabChange, unreadCounts = {} }) => {
  // Menu boczne
  const menuItems = [
    {
      title: "Odebrane",
      id: "inbox",
      icon: FaInbox,
      exact: true,
      badge: unreadCounts.inbox || 0
    },
    {
      title: "Wysłane",
      id: "sent",
      icon: FaPaperPlane
    },
    {
      title: "Ważne",
      id: "starred",
      icon: FaStar,
      badge: unreadCounts.starred || 0
    },
    {
      title: "Robocze",
      id: "drafts",
      icon: FaFolder,
      badge: unreadCounts.drafts || 0
    },
    {
      title: "Kosz",
      id: "trash",
      icon: FaTrash
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col overflow-y-auto rounded-lg">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={`px-4 py-3 border-l-4 font-medium transition-all duration-200 flex items-center ${
              activeTab === item.id 
                ? 'border-[#35530A] bg-green-50 text-[#35530A]' 
                : 'border-transparent text-gray-500 hover:text-[#35530A] hover:bg-green-50'
            }`}
          >
            <item.icon className={`mr-2 flex-shrink-0 ${activeTab === item.id ? 'text-[#35530A]' : 'text-gray-400'}`} />
            <span className="flex-grow">{item.title}</span>
            {item.badge > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

MessageSidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  unreadCounts: PropTypes.object
};

export default MessageSidebar;
