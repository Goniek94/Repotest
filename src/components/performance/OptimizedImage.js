import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { optimizeImageUrl } from '../../utils/performanceOptimizer';

/**
 * Komponent OptimizedImage - zoptymalizowany komponent obrazu
 * Obsługuje lazy loading, optymalizację obrazów, placeholdery i błędy ładowania
 * 
 * @param {Object} props - Właściwości komponentu
 * @returns {JSX.Element} - Zoptymalizowany komponent obrazu
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  format = 'avif',
  placeholder = true,
  fallbackSrc = '/images/auto-788747_1280.jpg',
  onLoad,
  onError,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  
  // Opcje optymalizacji obrazu
  const imageOptions = {
    width,
    height,
    format,
    quality
  };
  
  // Zoptymalizowany URL obrazu
  const optimizedSrc = optimizeImageUrl(src, imageOptions);
  
  // Obsługa błędów ładowania obrazu
  const handleError = (e) => {
    setError(true);
    e.target.src = fallbackSrc;
    
    if (onError) {
      onError(e);
    }
  };
  
  // Obsługa załadowania obrazu
  const handleLoad = (e) => {
    setLoaded(true);
    
    if (onLoad) {
      onLoad(e);
    }
  };
  
  // Efekt dla obserwatora przecięcia (Intersection Observer)
  useEffect(() => {
    // Jeśli obraz ma priorytet, nie używaj lazy loading
    if (priority) {
      return;
    }
    
    // Sprawdź, czy przeglądarka obsługuje Intersection Observer
    if (!('IntersectionObserver' in window)) {
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Jeśli element jest widoczny, załaduj obraz
          if (entry.isIntersecting && imgRef.current) {
            imgRef.current.src = optimizedSrc;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px', // Załaduj obraz, gdy jest 200px od widocznego obszaru
        threshold: 0.01 // Załaduj, gdy 1% obrazu jest widoczny
      }
    );
    
    // Obserwuj element
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    // Cleanup
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [optimizedSrc, priority]);
  
  return (
    <div className={`relative ${className || ''}`} style={{ width, height }}>
      {/* Placeholder podczas ładowania */}
      {placeholder && !loaded && !error && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded-[2px]"
          style={{ width, height }}
        />
      )}
      
      {/* Obraz */}
      <img
        ref={imgRef}
        src={priority ? optimizedSrc : (loaded ? optimizedSrc : '')}
        alt={alt || ''}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        {...rest}
      />
      
      {/* Wskaźnik błędu */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          <span>Nie udało się załadować obrazu</span>
        </div>
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  priority: PropTypes.bool,
  quality: PropTypes.number,
  format: PropTypes.oneOf(['avif', 'webp', 'jpeg', 'png']),
  placeholder: PropTypes.bool,
  fallbackSrc: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default OptimizedImage;
