import { useState, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
  const getMatches = () =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false;

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // @ts-ignore
      mediaQuery.addListener(handler);
    }
    setMatches(mediaQuery.matches);
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        // @ts-ignore
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
