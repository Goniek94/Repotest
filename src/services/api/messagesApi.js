// src/services/api/messagesApi.js
// Plik proxy dla zachowania kompatybilności wstecznej

// Importujemy wszystkie funkcje z nowego API
import MessagesService from './messages/index';

// Eksportujemy MessagesService jako domyślny eksport
export default MessagesService;

// Reeksportujemy wszystkie funkcje z nowego API
export * from './messages/index';