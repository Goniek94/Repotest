import { useEffect } from 'react';
import { 
  preloadCriticalImages, 
  preloadCriticalScripts, 
  preloadCriticalStyles,
  addResourceHints,
  optimizeJavaScriptLoading,
  optimizeBundleSize
} from '../../utils/performanceOptimizer';

/**
 * Komponent odpowiedzialny za preładowanie krytycznych zasobów
 * Powinien być umieszczony na początku aplikacji
 */
const ResourcePreloader = () => {
  useEffect(() => {
    // Preload krytycznych obrazów
    preloadCriticalImages([
      '/images/auto-788747_1280.jpg',
      '/images/logo.png',
      '/images/placeholder.jpg'
    ]);
    
    // Preload krytycznych skryptów - używamy ścieżek względnych
    preloadCriticalScripts([
      // Usuwamy preload skryptów, które mogą nie istnieć
    ]);
    
    // Preload krytycznych stylów - używamy ścieżek względnych
    preloadCriticalStyles([
      // Usuwamy preload stylów, które mogą nie istnieć
    ]);
    
    // Dodaj wskazówki zasobów
    addResourceHints([
      ['http://localhost:5000', 'preconnect'],
      ['https://fonts.googleapis.com', 'preconnect'],
      ['https://fonts.gstatic.com', 'preconnect'],
      ['https://cdn.jsdelivr.net', 'dns-prefetch']
    ]);
    
    // Dodaj preload dla czcionek
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.as = 'font';
    fontPreload.type = 'font/woff2';
    fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontPreload.crossOrigin = 'anonymous';
    document.head.appendChild(fontPreload);
    
    // Dodaj preload dla krytycznego CSS
    const criticalCss = `
      :root {
        --primary-color: #35530A;
        --secondary-color: #6c757d;
        --background-color: #f8f9fa;
      }
      
      body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', sans-serif;
        background-color: var(--background-color);
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 15px;
      }
      
      img {
        max-width: 100%;
        height: auto;
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCss;
    document.head.appendChild(style);
    
    // Opóźnij ładowanie nieistotnych zasobów
    const deferNonCritical = () => {
      // Sprawdzamy, czy skrypty istnieją przed ich dodaniem
      // Na razie wyłączamy ładowanie nieistotnych skryptów
      // do czasu zidentyfikowania poprawnych ścieżek
      
      // Sprawdzamy, czy style istnieją przed ich dodaniem
      // Na razie wyłączamy ładowanie nieistotnych stylów
      // do czasu zidentyfikowania poprawnych ścieżek
    };
    
    // Użyj requestIdleCallback do opóźnienia ładowania nieistotnych zasobów
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        setTimeout(deferNonCritical, 2000);
      }, { timeout: 5000 });
    } else {
      setTimeout(deferNonCritical, 2000);
    }
    
    // Dodaj obserwator wydajności
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach(entry => {
          // Loguj tylko w trybie deweloperskim
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Performance] ${entry.name}: ${entry.startTime.toFixed(0)}ms`);
          }
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift', 'first-input'] });
    }
    
    // Optymalizacja ładowania JavaScript
    optimizeJavaScriptLoading();
    
    // Optymalizacja rozmiaru pakietu
    optimizeBundleSize();
  }, []);
  
  // Komponent nie renderuje nic
  return null;
};

export default ResourcePreloader;
