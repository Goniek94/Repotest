import React from 'react';

/**
 * Komponent do wyświetlania awatara użytkownika
 * @param {Object} props - Właściwości komponentu
 * @param {string} props.name - Imię użytkownika (do wyświetlenia inicjałów)
 * @param {string} props.email - Email użytkownika (używany jako fallback, jeśli nie ma imienia)
 * @param {string} props.imageUrl - URL do zdjęcia profilowego
 * @param {string} props.size - Rozmiar awatara ('sm', 'md', 'lg')
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element} - Komponent awatara użytkownika
 */
function UserAvatar({ name, email, imageUrl, size = 'md', className = '' }) {
  // Określenie rozmiaru na podstawie propsa size
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };
  
  // Pobranie inicjałów użytkownika
  const getInitials = () => {
    if (name) {
      return name.split(' ').map(part => part.charAt(0).toUpperCase()).join('').substring(0, 2);
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };
  
  return (
    <div className={`rounded-full bg-[#35530A] bg-opacity-10 flex items-center justify-center flex-shrink-0 border border-gray-200 ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name || email || 'User'} 
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span className="text-[#35530A] font-medium">{getInitials()}</span>
      )}
    </div>
  );
}

export default UserAvatar;
