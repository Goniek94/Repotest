import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import unifiedNotificationService from '../services/UnifiedNotificationService';

// Tworzenie kontekstu
export const SocketContext = createContext(null);

// Provider dla kontekstu Socket
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  // Inicjalizacja socketa po zalogowaniu
  useEffect(() => {
    let cleanedUp = false;

    const initializeSocket = async () => {
      try {
        if (isAuthenticated && user) {
          await unifiedNotificationService.connect();
          const s = unifiedNotificationService.socket;

          if (!cleanedUp && s) {
            // Aktualizacja statusu połączenia
            s.on('connect', () => setIsConnected(true));
            s.on('disconnect', () => setIsConnected(false));
            s.on('connect_error', () => setIsConnected(false));

            setSocket(s);
            setIsConnected(unifiedNotificationService.isConnected());
          }
        } else {
          // Brak autoryzacji — rozłącz
          unifiedNotificationService.disconnect();
          setSocket(null);
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Błąd inicjalizacji Socket.io:', error);
        setIsConnected(false);
      }
    };

    initializeSocket();

    // Czyszczenie przy odmontowaniu
    return () => {
      cleanedUp = true;
      unifiedNotificationService.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook do łatwego dostępu do kontekstu
export const useSocket = () => useContext(SocketContext);

export default SocketContext;
