import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  lazy = true,
  placeholder = 'blur',
  quality = 75,
  sizes = '100vw',
  priority = false,
  onLoad,
  onError,
  fallback = '/placeholder-car.jpg'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer dla lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Załaduj obrazy 50px przed wejściem w viewport
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, priority, isInView]);

  // Generuj srcSet dla responsive images
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc || hasError) return '';
    
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    return sizes
      .map(size => `${baseSrc}?w=${size}&q=${quality} ${size}w`)
      .join(', ');
  };

  // Obsługa ładowania obrazu
  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  // Obsługa błędów ładowania
  const handleError = (e) => {
    setHasError(true);
    setIsLoaded(true);
    if (onError) onError(e);
  };

  // Placeholder blur effect
  const getPlaceholderStyle = () => {
    if (placeholder === 'blur' && !isLoaded) {
      return {
        filter: 'blur(10px)',
        transform: 'scale(1.1)',
        transition: 'filter 0.3s ease, transform 0.3s ease'
      };
    }
    return {
      filter: isLoaded ? 'none' : 'blur(0px)',
      transform: isLoaded ? 'scale(1)' : 'scale(1)',
      transition: 'filter 0.3s ease, transform 0.3s ease'
    };
  };

  // Jeśli nie ma src lub jest błąd, pokaż fallback
  const imageSrc = hasError ? fallback : src;
  const shouldShowImage = isInView && imageSrc;

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder podczas ładowania */}
      {!isLoaded && placeholder === 'blur' && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='%23f3f4f6'/%3e%3c/svg%3e")`,
            backgroundSize: 'cover'
          }}
        />
      )}

      {/* Główny obraz */}
      {shouldShowImage && (
        <img
          src={imageSrc}
          srcSet={generateSrcSet(imageSrc)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-cover
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            transition-opacity duration-300 ease-in-out
          `}
          style={getPlaceholderStyle()}
        />
      )}

      {/* Loading indicator */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-[#35530A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Nie można załadować obrazu</p>
          </div>
        </div>
      )}

      {/* Overlay dla dodatkowych informacji */}
      {isLoaded && !hasError && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-white text-center">
            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-xs">Kliknij aby powiększyć</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
