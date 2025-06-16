import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

/**
 * Kontekst do zarządzania połączeniem WebSocket
 * @type {React.Context}
 */
export const SocketContext = createContext(null);

/**
 * Provider dla kontekstu WebSocket
 * Zarządza połączeniem z serwerem WebSocket i udostępnia je w całej aplikacji
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @returns {JSX.Element}
 */
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, user, token } = useAuth();
  
  // Inicjalizacja połączenia WebSocket
  useEffect(() => {
    // Tworzenie połączenia tylko dla zalogowanych użytkowników
    if (isAuthenticated && user && token) {
      // Określenie adresu serwera WebSocket
      const socketUrl = process.env.REACT_APP_SOCKET_URL || window.location.origin;
      
      // Inicjalizacja połączenia z przekazaniem tokenu autoryzacyjnego
      const socketInstance = io(socketUrl, {
        auth: {
          token
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      
      // Obsługa zdarzeń połączenia
      socketInstance.on('connect', () => {
        console.log('WebSocket połączony');
      });
      
      socketInstance.on('connect_error', (error) => {
        console.error('Błąd połączenia WebSocket:', error);
      });
      
      socketInstance.on('disconnect', (reason) => {
        console.log('WebSocket rozłączony:', reason);
      });
      
      // Zapisanie instancji socketu w stanie
      setSocket(socketInstance);
      
      // Czyszczenie przy odmontowaniu komponentu
      return () => {
        socketInstance.disconnect();
        setSocket(null);
      };
    }
    
    // Jeśli użytkownik nie jest zalogowany, upewnij się, że socket jest null
    if (!isAuthenticated && socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [isAuthenticated, user, token]);
  
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

/**
 * Hook do korzystania z kontekstu WebSocket
 * @returns {Socket|null} Instancja socket.io lub null, jeśli nie ma połączenia
 */
export const useSocket = () => {
  const socket = React.useContext(SocketContext);
  return socket;
};
