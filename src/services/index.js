import AuthService from './auth';
import AdsService from './ads';
import messagesApi from './api/messagesApi';

export {
  AuthService,
  AdsService,
  messagesApi
};

// Domyślny eksport wszystkich usług jako obiekt
export default {
  auth: AuthService,
  ads: AdsService,
  messages: messagesApi
};
