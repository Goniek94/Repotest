import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Przewiń stronę na górę
  }, [pathname]);

  return null;
};

export default ScrollToTop;
