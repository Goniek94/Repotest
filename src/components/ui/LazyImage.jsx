import React, { useState, useRef, useEffect } from 'react';
import { Image, AlertCircle } from 'lucide-react';

/**
 * LazyImage Component
 * Komponent do lazy loading obrazów z fallback i placeholder
 */
const LazyImage = ({
  src,
  alt = '',
  className = '',
  placeholderClassName = '',
  errorClassName = '',
  width,
  height,
  style = {},
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  placeholder = null,
  errorFallback = null,
  showLoadingSpinner = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer do lazy loading
  useEffect(() => {
    const currentImgRef = imgRef.current;
    
    if (!currentImgRef || isInView) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setIsLoading(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(currentImgRef);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin, isInView]);

  // Obsługa ładowania obrazu
  const handleLoad = (event) => {
    setIsLoaded(true);
    setIsLoading(false);
    setHasError(false);
    onLoad?.(event);
  };

  // Obsługa błędu ładowania
  const handleError = (event) => {
    setHasError(true);
    setIsLoading(false);
    setIsLoaded(false);
    onError?.(event);
  };

  // Domyślny placeholder
  const defaultPlaceholder = (
    <div 
      className={`flex items-center justify-center bg-gray-100 ${placeholderClassName}`}
      style={{ width, height, ...style }}
    >
      <div className="text-center text-gray-400">
        <Image className="w-8 h-8 mx-auto mb-2" />
        {showLoadingSpinner && isLoading && (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto"></div>
        )}
        {!isLoading && <p className="text-sm">Ładowanie...</p>}
      </div>
    </div>
  );

  // Domyślny error fallback
  const defaultErrorFallback = (
    <div 
      className={`flex items-center justify-center bg-red-50 border border-red-200 ${errorClassName}`}
      style={{ width, height, ...style }}
    >
      <div className="text-center text-red-400">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm">Błąd ładowania</p>
      </div>
    </div>
  );

  // Jeśli wystąpił błąd, pokaż error fallback
  if (hasError) {
    return errorFallback || defaultErrorFallback;
  }

  // Jeśli obraz nie jest jeszcze w viewport, pokaż placeholder
  if (!isInView) {
    return placeholder || defaultPlaceholder;
  }

  return (
    <div ref={imgRef} className="relative">
      {/* Placeholder podczas ładowania */}
      {!isLoaded && (placeholder || defaultPlaceholder)}
      
      {/* Właściwy obraz */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={{ 
          ...style,
          ...(isLoaded ? {} : { position: 'absolute', top: 0, left: 0 })
        }}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

/**
 * LazyImageGallery Component
 * Komponent galerii z lazy loading dla wielu obrazów
 */
export const LazyImageGallery = ({
  images = [],
  className = '',
  imageClassName = '',
  columns = 4,
  gap = 4,
  aspectRatio = '1/1',
  onImageClick,
  showIndex = false,
  ...props
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  const gapClasses = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  return (
    <div 
      className={`grid ${gridCols[columns] || 'grid-cols-4'} ${gapClasses[gap] || 'gap-4'} ${className}`}
      {...props}
    >
      {images.map((image, index) => (
        <div
          key={image.id || index}
          className="relative cursor-pointer group"
          style={{ aspectRatio }}
          onClick={() => onImageClick?.(image, index)}
        >
          <LazyImage
            src={image.src || image.url || image}
            alt={image.alt || image.name || `Obraz ${index + 1}`}
            className={`w-full h-full object-cover rounded-lg group-hover:opacity-90 transition-opacity ${imageClassName}`}
          />
          
          {/* Index overlay */}
          {showIndex && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              {index + 1}
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg" />
        </div>
      ))}
    </div>
  );
};

/**
 * LazyImageWithThumbnail Component
 * Komponent z thumbnail i pełnym obrazem
 */
export const LazyImageWithThumbnail = ({
  src,
  thumbnailSrc,
  alt = '',
  className = '',
  thumbnailClassName = '',
  showFullImageOnHover = false,
  ...props
}) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  const handleThumbnailLoad = () => {
    setThumbnailLoaded(true);
  };

  const handleMouseEnter = () => {
    if (showFullImageOnHover) {
      setShowFullImage(true);
    }
  };

  const handleMouseLeave = () => {
    if (showFullImageOnHover) {
      setShowFullImage(false);
    }
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail */}
      <LazyImage
        src={thumbnailSrc || src}
        alt={alt}
        className={`${thumbnailClassName} ${showFullImage ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleThumbnailLoad}
        {...props}
      />
      
      {/* Full image on hover */}
      {showFullImage && thumbnailLoaded && (
        <div className="absolute inset-0">
          <LazyImage
            src={src}
            alt={alt}
            className={`${className} opacity-100 transition-opacity duration-300`}
            {...props}
          />
        </div>
      )}
    </div>
  );
};

export default LazyImage;
