import React, { useState } from 'react';
import { FiBell, FiCheck, FiTrash, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nowa wiadomość od użytkownika Janek...',
      date: '2024-01-06',
      isRead: false,
      content: 'Witaj! Interesuje mnie Twoje ogłoszenie. Czy możesz podać więcej szczegółów?',
      expanded: false
    },
    {
      id: 2,
      title: 'Potwierdzenie wystawienia ogłoszenia...',
      date: '2024-01-05',
      isRead: true,
      content: 'Twoje ogłoszenie zostało pomyślnie opublikowane. Możesz je teraz zobaczyć na stronie głównej.',
      expanded: false
    },
    {
      id: 3,
      title: 'Oferta specjalna: Pakiet wyróżnień...',
      date: '2024-01-04',
      isRead: true,
      content: 'Skorzystaj z naszej oferty specjalnej i wyróżnij swoje ogłoszenie już teraz!',
      expanded: false
    }
  ]);

  const toggleNotification = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, expanded: !notification.expanded, isRead: true }
          : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: 50 }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-green-600 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FiBell className="w-8 h-8 text-white" />
          <h2 className="text-2xl font-bold text-white">POWIADOMIENIA</h2>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-white hover:text-green-100 flex items-center space-x-2"
        >
          <FiCheck className="w-5 h-5" />
          <span>Oznacz wszystkie jako przeczytane</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="p-6">
        <AnimatePresence>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map(notification => (
                <motion.div
                  key={notification.id}
                  variants={notificationVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`group relative rounded-lg border ${
                    notification.isRead 
                      ? 'bg-white hover:bg-gray-50' 
                      : 'bg-green-50 hover:bg-green-100'
                  } transition-colors duration-200`}
                >
                  <div
                    onClick={() => toggleNotification(notification.id)}
                    className="p-4 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-semibold ${
                          notification.isRead 
                            ? 'text-gray-700' 
                            : 'text-green-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.date}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                        )}
                        {notification.expanded ? (
                          <FiChevronUp className="text-gray-400" />
                        ) : (
                          <FiChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {notification.expanded && (
                      <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                          <p className="text-gray-600">{notification.content}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <FiTrash className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Brak nowych powiadomień
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;