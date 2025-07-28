import React, { memo } from 'react';
import { Link } from 'react-router-dom';

/**
 * Komponent dymka powiadomień z ikonką
 * Wyświetla ikonkę powiadomień z liczbą nieprzeczytanych powiadomień
 * 
 * @param {Object} props - Właściwości komponentu
 * @param {number} props.count - Liczba nieprzeczytanych powiadomień
 * @param {string} props.type - Typ powiadomienia ('notifications' lub 'messages')
 * @param {string} props.className - Dodatkowe klasy CSS
 * @param {string} props.size - Rozmiar ikony ('sm', 'md', 'lg')
 * @param {boolean} props.showZero - Czy pokazywać badge gdy count = 0
 * @param {string} props.linkTo - Ścieżka do przekierowania po kliknięciu
 * @returns {JSX.Element}
 */
const NotificationBadge = memo(({
  count = 0,
  type = 'notifications',
  className = '',
  size = 'md',
  showZero = false,
  linkTo = '/profil/notifications'
}) => {
  // Mapowanie typów na ikonki
  const iconMap = {
    notifications: '/images/icons/Notifications.svg',
    messages: '/images/icons/messages.svg', // Dedykowana ikonka dla wiadomości
    warning: '/images/icons/warning.svg',
    payment: '/images/icons/payment.svg'
  };

  // Mapowanie rozmiarów
  const sizeMap = {
    sm: {
      icon: 'w-4 h-4',
      badge: 'w-4 h-4 text-xs',
      container: 'relative'
    },
    md: {
      icon: 'w-6 h-6',
      badge: 'w-5 h-5 text-xs',
      container: 'relative'
    },
    lg: {
      icon: 'w-8 h-8',
      badge: 'w-6 h-6 text-sm',
      container: 'relative'
    }
  };

  const iconSrc = iconMap[type] || iconMap.notifications;
  const sizes = sizeMap[size] || sizeMap.md;
  const shouldShowBadge = count > 0 || showZero;

  // Formatowanie liczby (99+ dla liczb > 99)
  const formatCount = (num) => {
    if (num > 99) return '99+';
    return num.toString();
  };

  const BadgeContent = () => (
    <div className={`${sizes.container} ${className}`}>
      {/* Ikonka powiadomień */}
      <img 
        src={iconSrc}
        alt={`${type} icon`}
        className={`${sizes.icon} transition-opacity hover:opacity-80`}
        style={{ 
          filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'
        }}
      />
      
      {/* Dymek z liczbą */}
      {shouldShowBadge && (
        <div className={`
          absolute -top-2 -right-2 
          ${sizes.badge}
          bg-red-500 text-white 
          rounded-full 
          flex items-center justify-center 
          font-bold 
          shadow-lg
          border-2 border-white
          min-w-[20px]
          animate-pulse
        `}>
          {formatCount(count)}
        </div>
      )}
      
      {/* Efekt świecenia dla nowych powiadomień */}
      {count > 0 && (
        <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></div>
      )}
    </div>
  );

  // Jeśli podano linkTo, owijamy w Link
  if (linkTo) {
    return (
      <Link 
        to={linkTo}
        className="inline-block transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full"
        aria-label={`${count} nieprzeczytanych powiadomień`}
      >
        <BadgeContent />
      </Link>
    );
  }

  // W przeciwnym razie zwracamy sam komponent
  return <BadgeContent />;
});

NotificationBadge.displayName = 'NotificationBadge';

export default NotificationBadge;
