// Performance Monitor dla Marketplace
// Monitoruje Core Web Vitals i inne metryki wydajności

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.isEnabled = process.env.NODE_ENV === 'production';
    
    if (this.isEnabled) {
      this.init();
    }
  }

  init() {
    // Monitoruj Core Web Vitals
    this.observeCoreWebVitals();
    
    // Monitoruj ładowanie zasobów
    this.observeResourceTiming();
    
    // Monitoruj Long Tasks
    this.observeLongTasks();
    
    // Monitoruj Layout Shifts
    this.observeLayoutShifts();
    
    // Wysyłaj metryki co 30 sekund
    setInterval(() => {
      this.sendMetrics();
    }, 30000);
  }

  // Core Web Vitals
  observeCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.metrics.lcp = {
            value: lastEntry.startTime,
            rating: this.getRating('lcp', lastEntry.startTime),
            timestamp: Date.now()
          };
          
          console.log('[Performance] LCP:', lastEntry.startTime.toFixed(2), 'ms');
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('[Performance] LCP observer not supported');
      }
    }

    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.metrics.fid = {
              value: entry.processingStart - entry.startTime,
              rating: this.getRating('fid', entry.processingStart - entry.startTime),
              timestamp: Date.now()
            };
            
            console.log('[Performance] FID:', (entry.processingStart - entry.startTime).toFixed(2), 'ms');
          });
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('[Performance] FID observer not supported');
      }
    }

    // Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          this.metrics.cls = {
            value: clsValue,
            rating: this.getRating('cls', clsValue),
            timestamp: Date.now()
          };
          
          console.log('[Performance] CLS:', clsValue.toFixed(4));
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('[Performance] CLS observer not supported');
      }
    }
  }

  // Resource Timing
  observeResourceTiming() {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry) => {
            // Monitoruj tylko duże zasoby (>100KB)
            if (entry.transferSize > 100000) {
              console.log('[Performance] Large resource:', {
                name: entry.name,
                size: (entry.transferSize / 1024).toFixed(2) + 'KB',
                duration: entry.duration.toFixed(2) + 'ms'
              });
            }
          });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (e) {
        console.warn('[Performance] Resource observer not supported');
      }
    }
  }

  // Long Tasks (>50ms)
  observeLongTasks() {
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry) => {
            console.warn('[Performance] Long task detected:', {
              duration: entry.duration.toFixed(2) + 'ms',
              startTime: entry.startTime.toFixed(2) + 'ms'
            });
            
            // Zapisz informacje o długich taskach
            if (!this.metrics.longTasks) {
              this.metrics.longTasks = [];
            }
            
            this.metrics.longTasks.push({
              duration: entry.duration,
              startTime: entry.startTime,
              timestamp: Date.now()
            });
          });
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        console.warn('[Performance] Long task observer not supported');
      }
    }
  }

  // Layout Shifts
  observeLayoutShifts() {
    if ('PerformanceObserver' in window) {
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry) => {
            if (entry.value > 0.1) { // Tylko znaczące shifty
              console.warn('[Performance] Significant layout shift:', {
                value: entry.value.toFixed(4),
                sources: entry.sources?.map(s => s.node?.tagName).join(', ')
              });
            }
          });
        });
        
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutShiftObserver);
      } catch (e) {
        console.warn('[Performance] Layout shift observer not supported');
      }
    }
  }

  // Ocena wydajności (good/needs-improvement/poor)
  getRating(metric, value) {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  // Pomiar czasu wykonania funkcji
  measureFunction(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    
    return result;
  }

  // Pomiar czasu ładowania komponentu
  measureComponentRender(componentName, renderFn) {
    return this.measureFunction(`${componentName} render`, renderFn);
  }

  // Pomiar czasu API call
  measureApiCall(endpoint, apiCall) {
    return this.measureFunction(`API ${endpoint}`, apiCall);
  }

  // Wysyłanie metryk (w przyszłości można wysyłać do analytics)
  sendMetrics() {
    if (Object.keys(this.metrics).length === 0) return;

    // W przyszłości można wysyłać do Google Analytics, własnego API, etc.
    console.log('[Performance] Current metrics:', this.metrics);
    
    // Zapisz w localStorage dla debugowania
    localStorage.setItem('marketplace-performance-metrics', JSON.stringify({
      ...this.metrics,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }));
  }

  // Pobierz aktualne metryki
  getMetrics() {
    return { ...this.metrics };
  }

  // Wyczyść metryki
  clearMetrics() {
    this.metrics = {};
  }

  // Zatrzymaj monitorowanie
  disconnect() {
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (e) {
        console.warn('[Performance] Error disconnecting observer:', e);
      }
    });
    this.observers = [];
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export funkcji pomocniczych
export const measureFunction = (name, fn) => performanceMonitor.measureFunction(name, fn);
export const measureComponentRender = (name, fn) => performanceMonitor.measureComponentRender(name, fn);
export const measureApiCall = (endpoint, fn) => performanceMonitor.measureApiCall(endpoint, fn);
export const getPerformanceMetrics = () => performanceMonitor.getMetrics();
export const clearPerformanceMetrics = () => performanceMonitor.clearMetrics();

export default performanceMonitor;
