import { useState, useEffect } from 'react';

/**
 * Hook do wykrywania media queries
 * @param {string} query - Media query string (np. '(min-width: 768px)')
 * @returns {boolean} - True jeśli media query pasuje
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    // Ustaw początkową wartość na podstawie aktualnego stanu
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Ustaw początkową wartość (na wypadek gdyby się zmieniła)
    setMatches(media.matches);
    
    // Funkcja obsługująca zmiany
    const listener = (event) => {
      setMatches(event.matches);
    };
    
    // Dodaj listener
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback dla starszych przeglądarek
      media.addListener(listener);
    }
    
    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
