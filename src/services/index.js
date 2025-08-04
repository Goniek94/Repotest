import AuthService from './auth';
import AdsService from './ads';
import MessagesService from './api/messagesApi';

export {
  AuthService,
  AdsService,
  MessagesService
};

// Domyślny eksport wszystkich usług jako obiekt
export default {
  auth: AuthService,
  ads: AdsService,
  messages: MessagesService
};
