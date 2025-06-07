import React from 'react';

/**
 * Narzędzia do optymalizacji wydajności aplikacji
 */

/**
 * Preload krytycznych obrazów
 * @param {Array} imageUrls - Lista URL obrazów do preloadowania
 */
export const preloadCriticalImages = (imageUrls) => {
  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) return;
  
  // Dodaj link preload dla każdego obrazu
  imageUrls.forEach(url => {
    if (!url) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

/**
 * Preload krytycznych skryptów
 * @param {Array} scriptPaths - Lista ścieżek do skryptów
 */
export const preloadCriticalScripts = (scriptPaths) => {
  if (!scriptPaths || !Array.isArray(scriptPaths) || scriptPaths.length === 0) return;
  
  // Dodaj link preload dla każdego skryptu
  scriptPaths.forEach(path => {
    if (!path) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = path;
    document.head.appendChild(link);
  });
};

/**
 * Preload krytycznych stylów
 * @param {Array} stylePaths - Lista ścieżek do stylów
 */
export const preloadCriticalStyles = (stylePaths) => {
  if (!stylePaths || !Array.isArray(stylePaths) || stylePaths.length === 0) return;
  
  // Dodaj link preload dla każdego stylu
  stylePaths.forEach(path => {
    if (!path) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = path;
    document.head.appendChild(link);
  });
};

/**
 * Optymalizacja URL obrazu
 * @param {string} url - URL obrazu
 * @param {Object} options - Opcje optymalizacji
 * @returns {string} - Zoptymalizowany URL
 */
export const optimizeImageUrl = (url, options = {}) => {
  if (!url) return '';
  
  // Domyślne opcje
  const defaultOptions = {
    width: null,
    height: null,
    format: 'avif',
    quality: 60, // Niższa jakość dla lepszej kompresji
    blur: false
  };
  
  // Połącz opcje
  const finalOptions = { ...defaultOptions, ...options };
  
  // Jeśli to URL zewnętrzny, zwróć go bez zmian
  if (url.startsWith('http') && !url.includes('localhost')) {
    return url;
  }
  
  // Dla lokalnych obrazów, użyj względnej ścieżki
  const baseUrl = url.startsWith('http') ? url : url;
  
  // Buduj parametry URL
  const params = new URLSearchParams();
  
  if (finalOptions.width) params.append('w', finalOptions.width);
  if (finalOptions.height) params.append('h', finalOptions.height);
  if (finalOptions.format) params.append('format', finalOptions.format);
  if (finalOptions.quality) params.append('quality', finalOptions.quality);
  if (finalOptions.blur) params.append('blur', finalOptions.blur);
  
  // Zwróć zoptymalizowany URL
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Lazy load komponentu z preloadem
 * @param {Function} importFunc - Funkcja importująca komponent
 * @param {boolean} preloadNow - Czy preloadować od razu
 * @returns {Promise} - Promise z komponentem
 */
export const lazyWithPreload = (importFunc, preloadNow = false) => {
  const Component = React.lazy(importFunc);
  Component.preload = importFunc;
  
  if (preloadNow) {
    importFunc();
  }
  
  return Component;
};

/**
 * Preload komponentów w czasie bezczynności
 * @param {Array} importFuncs - Lista funkcji importujących komponenty
 */
export const preloadComponentsInIdle = (importFuncs) => {
  if (!importFuncs || !Array.isArray(importFuncs) || importFuncs.length === 0) return;
  
  // Funkcja do preloadowania komponentów
  const preloadInIdle = () => {
    importFuncs.forEach(importFunc => {
      if (typeof importFunc === 'function') {
        importFunc();
      }
    });
  };
  
  // Użyj requestIdleCallback jeśli dostępne, w przeciwnym razie setTimeout
  if (typeof window !== 'undefined') {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(preloadInIdle, { timeout: 2000 });
    } else {
      setTimeout(preloadInIdle, 1000);
    }
  }
};

/**
 * Dodaj prefetch dla zasobów
 * @param {Array} resources - Lista zasobów do prefetchowania
 * @param {string} type - Typ zasobu (image, script, style, font)
 */
export const addPrefetch = (resources, type = 'image') => {
  if (!resources || !Array.isArray(resources) || resources.length === 0) return;
  
  resources.forEach(resource => {
    if (!resource) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    
    switch (type) {
      case 'image':
        link.as = 'image';
        break;
      case 'script':
        link.as = 'script';
        break;
      case 'style':
        link.as = 'style';
        break;
      case 'font':
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        break;
      default:
        link.as = 'fetch';
    }
    
    link.href = resource;
    document.head.appendChild(link);
  });
};

/**
 * Opóźnij ładowanie nieistotnych zasobów
 * @param {Function} callback - Funkcja do wykonania po opóźnieniu
 * @param {number} delay - Opóźnienie w ms
 */
export const deferNonCriticalLoad = (callback, delay = 3000) => {
  if (typeof callback !== 'function') return;
  
  // Użyj requestIdleCallback jeśli dostępne, w przeciwnym razie setTimeout
  if (typeof window !== 'undefined') {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        setTimeout(callback, delay);
      }, { timeout: delay + 1000 });
    } else {
      setTimeout(callback, delay);
    }
  }
};

/**
 * Dodaj wskazówki zasobów dla przeglądarki
 * @param {Array} hints - Lista wskazówek w formacie [url, type]
 */
export const addResourceHints = (hints) => {
  if (!hints || !Array.isArray(hints) || hints.length === 0) return;
  
  hints.forEach(([url, type]) => {
    if (!url || !type) return;
    
    const link = document.createElement('link');
    link.rel = type; // 'preconnect', 'dns-prefetch', etc.
    link.href = url;
    
    if (type === 'preconnect') {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  });
};

/**
 * Optymalizacja nieużywanego kodu JavaScript
 * Analizuje i opóźnia ładowanie nieużywanych skryptów
 */
export const optimizeJavaScriptLoading = () => {
  // Funkcja do opóźnienia ładowania skryptów
  const deferScriptLoading = () => {
    // Lista skryptów, które mogą być ładowane z opóźnieniem
    const deferredScripts = document.querySelectorAll('script[defer]');
    
    // Dla każdego skryptu z atrybutem defer
    deferredScripts.forEach(script => {
      // Utwórz nowy element script
      const newScript = document.createElement('script');
      
      // Kopiuj wszystkie atrybuty
      Array.from(script.attributes).forEach(attr => {
        if (attr.name !== 'defer') {
          newScript.setAttribute(attr.name, attr.value);
        }
      });
      
      // Ustaw async na true
      newScript.async = true;
      
      // Zastąp oryginalny skrypt
      script.parentNode.replaceChild(newScript, script);
    });
  };
  
  // Użyj requestIdleCallback do opóźnienia ładowania skryptów
  if (window.requestIdleCallback) {
    window.requestIdleCallback(deferScriptLoading, { timeout: 3000 });
  } else {
    setTimeout(deferScriptLoading, 3000);
  }
  
  // Dodaj obserwator zasobów, aby monitorować ładowanie skryptów
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        // Loguj tylko w trybie deweloperskim
        if (process.env.NODE_ENV === 'development' && entry.initiatorType === 'script') {
          debug(`[Script Loading] ${entry.name}: ${entry.duration.toFixed(0)}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
};

/**
 * Optymalizacja rozmiaru pakietu
 * Dynamicznie ładuje komponenty tylko wtedy, gdy są potrzebne
 */
export const optimizeBundleSize = () => {
  // Funkcja do dynamicznego importowania modułów
  const dynamicImport = (modulePath) => {
    return new Promise((resolve) => {
      import(/* webpackChunkName: "[request]" */ `${modulePath}`)
        .then(module => {
          resolve(module.default || module);
        })
        .catch(err => {
          console.error(`Error loading module: ${modulePath}`, err);
          resolve(null);
        });
    });
  };
  
  // Eksportuj funkcję do dynamicznego importowania
  window.__dynamicImport = dynamicImport;
  
  // Dodaj obserwator wydajności dla ładowania chunków
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        // Filtruj tylko chunki webpack
        if (entry.name.includes('chunk') && process.env.NODE_ENV === 'development') {
          debug(`[Chunk Loading] ${entry.name}: ${entry.duration.toFixed(0)}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
};

// Utwórz obiekt przed eksportem, aby uniknąć błędu ESLint
const performanceOptimizer = {
  preloadCriticalImages,
  preloadCriticalScripts,
  preloadCriticalStyles,
  optimizeImageUrl,
  lazyWithPreload,
  preloadComponentsInIdle,
  addPrefetch,
  deferNonCriticalLoad,
  addResourceHints,
  optimizeJavaScriptLoading,
  optimizeBundleSize
};

export default performanceOptimizer;
