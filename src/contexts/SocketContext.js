import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import notificationService from '../services/notifications';
import { io } from 'socket.io-client';

// Tworzenie kontekstu
export const SocketContext = createContext(null);

// Provider dla kontekstu Socket
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  
  // Inicjalizacja socketa po zalogowaniu
  useEffect(() => {
    let socketInstance = null;
    
    const initializeSocket = async () => {
      try {
        if (isAuthenticated && user) {
          // Inicjalizacja socketa - backend automatycznie odczyta token z HttpOnly cookies
          const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          socketInstance = io(serverUrl, {
            withCredentials: true, // Ważne: wysyła HttpOnly cookies
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000
          });
          
          // Obsługa zdarzeń
          socketInstance.on('connect', () => {
            console.log('Socket.io połączony');
            setIsConnected(true);
            
            // Emituj zdarzenia dla komponentów
            socketInstance.emit = function(originalEmit) {
              return function(...args) {
                if (this.connected) {
                  return originalEmit.apply(this, args);
                }
                console.warn('Próba emitowania zdarzenia bez połączenia:', args[0]);
                return this;
              };
            }(socketInstance.emit);
          });
          
          socketInstance.on('disconnect', () => {
            console.log('Socket.io rozłączony');
            setIsConnected(false);
          });
          
          socketInstance.on('connect_error', (error) => {
            console.error('Błąd połączenia Socket.io:', error);
            setIsConnected(false);
          });
          
          // Mapowanie zdarzeń z serwisu powiadomień na zdarzenia socketa
          // Dzięki temu komponenty mogą używać socket.on('notification:new', ...)
          notificationService.on('notification', (notification) => {
            if (socketInstance) {
              socketInstance.emit('notification:new', notification);
            }
          });
          
          notificationService.on('notification_updated', (data) => {
            if (socketInstance) {
              socketInstance.emit('notification:read', data);
            }
          });
          
          notificationService.on('all_notifications_read', () => {
            if (socketInstance) {
              socketInstance.emit('notification:read-all');
            }
          });
          
          notificationService.on('notification_deleted', (data) => {
            if (socketInstance) {
              socketInstance.emit('notification:deleted', data);
            }
          });
          
          // Ustawienie socketa w stanie
          setSocket(socketInstance);
          
          // Połącz z serwerem powiadomień - używa cookies automatycznie
          await notificationService.connect();
        }
      } catch (error) {
        console.error('Błąd inicjalizacji Socket.io:', error);
      }
    };
    
    if (isAuthenticated && user) {
      initializeSocket();
    } else {
      // Rozłącz socket jeśli użytkownik nie jest zalogowany
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      notificationService.disconnect();
    }
    
    // Czyszczenie przy odmontowaniu
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
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
