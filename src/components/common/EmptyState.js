import React from 'react';

/**
 * Komponent do wyświetlania informacji o braku danych
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.icon - Ikona do wyświetlenia
 * @param {string} props.title - Tytuł komunikatu
 * @param {string} props.message - Treść komunikatu
 * @param {React.ReactNode} props.action - Opcjonalny przycisk akcji
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element} - Komponent informujący o braku danych
 */
function EmptyState({ icon, title, message, action, className = '' }) {
  return (
    <div className={`text-center py-10 ${className}`}>
      {icon && <div className="mx-auto text-gray-300 text-3xl mb-2">{icon}</div>}
      {title && <h3 className="text-lg font-medium text-gray-700 mb-1">{title}</h3>}
      {message && <p className="text-sm text-gray-500 mb-4">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export default EmptyState;
