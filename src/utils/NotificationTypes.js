/**
 * Typy powiadomień w systemie
 * 
 * UWAGA: Ten plik musi być zsynchronizowany z odpowiadającym mu plikiem w backendzie:
 * backend/utils/notificationTypes.js
 */

export const NOTIFICATION_TYPES = {
  // Powiadomienia systemowe
  SYSTEM_NOTIFICATION: 'system_notification',
  MAINTENANCE_NOTIFICATION: 'maintenance_notification',
  
  // Powiadomienia związane z ogłoszeniami
  LISTING_ADDED: 'listing_added',
  LISTING_EXPIRING: 'listing_expiring',
  LISTING_EXPIRED: 'listing_expired',
  LISTING_STATUS_CHANGED: 'listing_status_changed',
  LISTING_LIKED: 'listing_liked',
  LISTING_VIEWED: 'listing_viewed',
  
  // Powiadomienia związane z wiadomościami
  NEW_MESSAGE: 'new_message',
  
  // Powiadomienia związane z komentarzami
  NEW_COMMENT: 'new_comment',
  COMMENT_REPLY: 'comment_reply',
  
  // Powiadomienia związane z płatnościami
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',
  PAYMENT_REFUNDED: 'payment_refunded',
  
  // Powiadomienia związane z kontem
  ACCOUNT_ACTIVITY: 'account_activity',
  PROFILE_VIEWED: 'profile_viewed'
};

/**
 * Grupy powiadomień (do wyświetlania w interfejsie użytkownika)
 */
export const NOTIFICATION_GROUPS = {
  SYSTEM: {
    name: 'Systemowe',
    types: [
      NOTIFICATION_TYPES.SYSTEM_NOTIFICATION,
      NOTIFICATION_TYPES.MAINTENANCE_NOTIFICATION
    ]
  },
  LISTINGS: {
    name: 'Ogłoszenia',
    types: [
      NOTIFICATION_TYPES.LISTING_ADDED,
      NOTIFICATION_TYPES.LISTING_EXPIRING,
      NOTIFICATION_TYPES.LISTING_EXPIRED,
      NOTIFICATION_TYPES.LISTING_STATUS_CHANGED,
      NOTIFICATION_TYPES.LISTING_LIKED,
      NOTIFICATION_TYPES.LISTING_VIEWED
    ]
  },
  MESSAGES: {
    name: 'Wiadomości',
    types: [
      NOTIFICATION_TYPES.NEW_MESSAGE
    ]
  },
  COMMENTS: {
    name: 'Komentarze',
    types: [
      NOTIFICATION_TYPES.NEW_COMMENT,
      NOTIFICATION_TYPES.COMMENT_REPLY
    ]
  },
  PAYMENTS: {
    name: 'Płatności',
    types: [
      NOTIFICATION_TYPES.PAYMENT_COMPLETED,
      NOTIFICATION_TYPES.PAYMENT_FAILED,
      NOTIFICATION_TYPES.PAYMENT_REFUNDED
    ]
  },
  ACCOUNT: {
    name: 'Konto',
    types: [
      NOTIFICATION_TYPES.ACCOUNT_ACTIVITY,
      NOTIFICATION_TYPES.PROFILE_VIEWED
    ]
  }
};

/**
 * Nazwy typów powiadomień (do wyświetlania w interfejsie użytkownika)
 */
export const NOTIFICATION_TYPE_NAMES = {
  [NOTIFICATION_TYPES.SYSTEM_NOTIFICATION]: 'Powiadomienie systemowe',
  [NOTIFICATION_TYPES.MAINTENANCE_NOTIFICATION]: 'Konserwacja systemu',
  [NOTIFICATION_TYPES.LISTING_ADDED]: 'Dodanie ogłoszenia',
  [NOTIFICATION_TYPES.LISTING_EXPIRING]: 'Wygasające ogłoszenie',
  [NOTIFICATION_TYPES.LISTING_EXPIRED]: 'Wygasłe ogłoszenie',
  [NOTIFICATION_TYPES.LISTING_STATUS_CHANGED]: 'Zmiana statusu ogłoszenia',
  [NOTIFICATION_TYPES.LISTING_LIKED]: 'Polubienie ogłoszenia',
  [NOTIFICATION_TYPES.LISTING_VIEWED]: 'Wyświetlenie ogłoszenia',
  [NOTIFICATION_TYPES.NEW_MESSAGE]: 'Nowa wiadomość',
  [NOTIFICATION_TYPES.NEW_COMMENT]: 'Nowy komentarz',
  [NOTIFICATION_TYPES.COMMENT_REPLY]: 'Odpowiedź na komentarz',
  [NOTIFICATION_TYPES.PAYMENT_COMPLETED]: 'Płatność zrealizowana',
  [NOTIFICATION_TYPES.PAYMENT_FAILED]: 'Płatność nieudana',
  [NOTIFICATION_TYPES.PAYMENT_REFUNDED]: 'Zwrot płatności',
  [NOTIFICATION_TYPES.ACCOUNT_ACTIVITY]: 'Aktywność na koncie',
  [NOTIFICATION_TYPES.PROFILE_VIEWED]: 'Wyświetlenie profilu'
};

/**
 * Opisy typów powiadomień (do wyświetlania w interfejsie użytkownika)
 */
export const NOTIFICATION_TYPE_DESCRIPTIONS = {
  [NOTIFICATION_TYPES.SYSTEM_NOTIFICATION]: 'Ważne informacje od administratorów serwisu',
  [NOTIFICATION_TYPES.MAINTENANCE_NOTIFICATION]: 'Informacje o planowanych pracach konserwacyjnych',
  [NOTIFICATION_TYPES.LISTING_ADDED]: 'Powiadomienia o pomyślnym dodaniu ogłoszenia',
  [NOTIFICATION_TYPES.LISTING_EXPIRING]: 'Powiadomienia o zbliżającym się terminie wygaśnięcia ogłoszenia',
  [NOTIFICATION_TYPES.LISTING_EXPIRED]: 'Powiadomienia o wygaśnięciu ogłoszenia',
  [NOTIFICATION_TYPES.LISTING_STATUS_CHANGED]: 'Powiadomienia o zmianie statusu ogłoszenia',
  [NOTIFICATION_TYPES.LISTING_LIKED]: 'Powiadomienia o dodaniu ogłoszenia do ulubionych przez innego użytkownika',
  [NOTIFICATION_TYPES.LISTING_VIEWED]: 'Powiadomienia o wyświetleniu ogłoszenia przez innego użytkownika',
  [NOTIFICATION_TYPES.NEW_MESSAGE]: 'Powiadomienia o nowych wiadomościach',
  [NOTIFICATION_TYPES.NEW_COMMENT]: 'Powiadomienia o nowych komentarzach do ogłoszeń',
  [NOTIFICATION_TYPES.COMMENT_REPLY]: 'Powiadomienia o odpowiedziach na komentarze',
  [NOTIFICATION_TYPES.PAYMENT_COMPLETED]: 'Powiadomienia o zrealizowanych płatnościach',
  [NOTIFICATION_TYPES.PAYMENT_FAILED]: 'Powiadomienia o nieudanych płatnościach',
  [NOTIFICATION_TYPES.PAYMENT_REFUNDED]: 'Powiadomienia o zwrotach płatności',
  [NOTIFICATION_TYPES.ACCOUNT_ACTIVITY]: 'Powiadomienia o aktywności na koncie',
  [NOTIFICATION_TYPES.PROFILE_VIEWED]: 'Powiadomienia o wyświetleniu profilu przez innego użytkownika'
};

/**
 * Ikony dla typów powiadomień (do wyświetlania w interfejsie użytkownika)
 * Używa nazw ikon z Material Icons (https://fonts.google.com/icons)
 */
export const NOTIFICATION_TYPE_ICONS = {
  [NOTIFICATION_TYPES.SYSTEM_NOTIFICATION]: 'announcement',
  [NOTIFICATION_TYPES.MAINTENANCE_NOTIFICATION]: 'build',
  [NOTIFICATION_TYPES.LISTING_ADDED]: 'post_add',
  [NOTIFICATION_TYPES.LISTING_EXPIRING]: 'timer',
  [NOTIFICATION_TYPES.LISTING_EXPIRED]: 'timer_off',
  [NOTIFICATION_TYPES.LISTING_STATUS_CHANGED]: 'update',
  [NOTIFICATION_TYPES.LISTING_LIKED]: 'favorite',
  [NOTIFICATION_TYPES.LISTING_VIEWED]: 'visibility',
  [NOTIFICATION_TYPES.NEW_MESSAGE]: 'message',
  [NOTIFICATION_TYPES.NEW_COMMENT]: 'comment',
  [NOTIFICATION_TYPES.COMMENT_REPLY]: 'reply',
  [NOTIFICATION_TYPES.PAYMENT_COMPLETED]: 'payments',
  [NOTIFICATION_TYPES.PAYMENT_FAILED]: 'error',
  [NOTIFICATION_TYPES.PAYMENT_REFUNDED]: 'money_off',
  [NOTIFICATION_TYPES.ACCOUNT_ACTIVITY]: 'account_circle',
  [NOTIFICATION_TYPES.PROFILE_VIEWED]: 'person'
};

/**
 * Kolory dla typów powiadomień (do wyświetlania w interfejsie użytkownika)
 */
export const NOTIFICATION_TYPE_COLORS = {
  [NOTIFICATION_TYPES.SYSTEM_NOTIFICATION]: '#f44336', // czerwony
  [NOTIFICATION_TYPES.MAINTENANCE_NOTIFICATION]: '#ff9800', // pomarańczowy
  [NOTIFICATION_TYPES.LISTING_ADDED]: '#4caf50', // zielony
  [NOTIFICATION_TYPES.LISTING_EXPIRING]: '#ff9800', // pomarańczowy
  [NOTIFICATION_TYPES.LISTING_EXPIRED]: '#f44336', // czerwony
  [NOTIFICATION_TYPES.LISTING_STATUS_CHANGED]: '#2196f3', // niebieski
  [NOTIFICATION_TYPES.LISTING_LIKED]: '#e91e63', // różowy
  [NOTIFICATION_TYPES.LISTING_VIEWED]: '#9c27b0', // fioletowy
  [NOTIFICATION_TYPES.NEW_MESSAGE]: '#2196f3', // niebieski
  [NOTIFICATION_TYPES.NEW_COMMENT]: '#4caf50', // zielony
  [NOTIFICATION_TYPES.COMMENT_REPLY]: '#4caf50', // zielony
  [NOTIFICATION_TYPES.PAYMENT_COMPLETED]: '#4caf50', // zielony
  [NOTIFICATION_TYPES.PAYMENT_FAILED]: '#f44336', // czerwony
  [NOTIFICATION_TYPES.PAYMENT_REFUNDED]: '#ff9800', // pomarańczowy
  [NOTIFICATION_TYPES.ACCOUNT_ACTIVITY]: '#2196f3', // niebieski
  [NOTIFICATION_TYPES.PROFILE_VIEWED]: '#9c27b0' // fioletowy
};

/**
 * Domyślne preferencje powiadomień
 */
export const DEFAULT_NOTIFICATION_PREFERENCES = {
  // Powiadomienia systemowe
  [NOTIFICATION_TYPES.SYSTEM_NOTIFICATION]: {
    app: true,
    email: true,
    sms: false
  },
  [NOTIFICATION_TYPES.MAINTENANCE_NOTIFICATION]: {
    app: true,
    email: true,
    sms: false
  },
  
  // Powiadomienia związane z ogłoszeniami
  [NOTIFICATION_TYPES.LISTING_ADDED]: {
    app: true,
    email: true,
    sms: false
  },
  [NOTIFICATION_TYPES.LISTING_EXPIRING]: {
    app: true,
    email: true,
    sms: false
  },
  [NOTIFICATION_TYPES.LISTING_EXPIRED]: {
    app: true,
    email: true,
    sms: false
  },
  [NOTIFICATION_TYPES.LISTING_STATUS_CHANGED]: {
    app: true,
    email: true,
    sms: false
  },
  [NOTIFICATION_TYPES.LISTING_LIKED]: {
    app: true,
    email: false,
    sms: false
  },
  [NOTIFICATION_TYPES.LISTING_VIEWED]: {
    app: true,
    email: false,
    sms: false
  },
  
  // Powiadomienia związane z wiadomościami
  [NOTIFICATION_TYPES.NEW_MESSAGE]: {
    app: true,
    email: true,
    sms: false
  },
  
  // Powiadomienia związane z komentarzami
  [NOTIFICATION_TYPES.NEW_COMMENT]: {
    app: true,
    email: true,
    sms: false
  },
  [NOTIFICATION_TYPES.COMMENT_REPLY]: {
    app: true,
    email: true,
    sms: false
  },
  
  // Powiadomienia związane z płatnościami
  [NOTIFICATION_TYPES.PAYMENT_COMPLETED]: {
    app: true,
    email: true,
    sms: false
  },
  [NOTIFICATION_TYPES.PAYMENT_FAILED]: {
    app: true,
    email: true,
    sms: false
  },
  [NOTIFICATION_TYPES.PAYMENT_REFUNDED]: {
    app: true,
    email: true,
    sms: false
  },
  
  // Powiadomienia związane z kontem
  [NOTIFICATION_TYPES.ACCOUNT_ACTIVITY]: {
    app: true,
    email: true,
    sms: false
  },
  [NOTIFICATION_TYPES.PROFILE_VIEWED]: {
    app: true,
    email: false,
    sms: false
  }
};

/**
 * Funkcja pomocnicza do formatowania daty powiadomienia
 * @param {Date} date - Data do sformatowania
 * @returns {string} - Sformatowana data
 */
export const formatNotificationDate = (date) => {
  const now = new Date();
  const notificationDate = new Date(date);
  
  // Różnica w milisekundach
  const diff = now - notificationDate;
  
  // Różnica w minutach
  const diffMinutes = Math.floor(diff / (1000 * 60));
  
  // Różnica w godzinach
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  
  // Różnica w dniach
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) {
    return 'przed chwilą';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minutę' : diffMinutes < 5 ? 'minuty' : 'minut'} temu`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'godzinę' : diffHours < 5 ? 'godziny' : 'godzin'} temu`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'dzień' : 'dni'} temu`;
  } else {
    return notificationDate.toLocaleDateString('pl-PL');
  }
};

/**
 * Funkcja zwracająca ikonę dla danego typu powiadomienia
 * @param {string} type - Typ powiadomienia
 * @returns {string} - Nazwa ikony Material Icons
 */
export const getNotificationIcon = (type) => {
  return NOTIFICATION_TYPE_ICONS[type] || 'notifications';
};

/**
 * Funkcja zwracająca kolor dla danego typu powiadomienia
 * @param {string} type - Typ powiadomienia
 * @returns {string} - Kolor w formacie HEX
 */
export const getNotificationColor = (type) => {
  return NOTIFICATION_TYPE_COLORS[type] || '#2196f3'; // domyślny niebieski
};

/**
 * Funkcja zwracająca nazwę dla danego typu powiadomienia
 * @param {string} type - Typ powiadomienia
 * @returns {string} - Nazwa typu powiadomienia
 */
export const getNotificationTypeName = (type) => {
  return NOTIFICATION_TYPE_NAMES[type] || 'Powiadomienie';
};

export default NOTIFICATION_TYPES;
