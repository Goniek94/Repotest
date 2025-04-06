import AuthService from './auth';
import AdsService from './ads';
import MessagesService from './messages';

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