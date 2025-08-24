import { useEffect, useRef } from 'react';

/**
 * Hook do obsługi kliknięć poza elementem
 * Automatycznie zamyka dropdown/modal gdy użytkownik kliknie poza nim
 * 
 * @param {function} callback - funkcja wywoływana przy kliknięciu poza elementem
 * @param {boolean} isActive - czy hook ma być aktywny (domyślnie true)
 * @returns {object} ref - referencja do elementu, który ma być monitorowany
 */
const useClickOutside = (callback, isActive = true) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event) => {
      // Sprawdź czy kliknięcie było poza elementem
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    // Dodaj event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback, isActive]);

  return ref;
};

export default useClickOutside;
