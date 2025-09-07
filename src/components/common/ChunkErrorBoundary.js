import React from 'react';
import './ChunkErrorBoundary.css';

/**
 * Error Boundary dla ChunkLoadError - ROZWIĄZANIE PRODUKCYJNE
 * Automatycznie retry failed chunks bez ingerencji użytkownika
 */
class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0,
      isRetrying: false 
    };
  }

  static getDerivedStateFromError(error) {
    // Sprawdź czy to ChunkLoadError
    if (error?.name === 'ChunkLoadError' || 
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('failed')) {
      return { hasError: true };
    }
    return null;
  }

  componentDidCatch(error, errorInfo) {
    console.warn('ChunkLoadError caught:', error, errorInfo);
    
    // Automatyczny retry dla ChunkLoadError
    if (this.isChunkLoadError(error) && this.state.retryCount < 3) {
      this.retryAfterDelay();
    }
  }

  isChunkLoadError = (error) => {
    return error?.name === 'ChunkLoadError' || 
           error?.message?.includes('Loading chunk') ||
           error?.message?.includes('failed');
  }

  retryAfterDelay = () => {
    this.setState({ isRetrying: true });
    
    // Retry po 1 sekundzie
    setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        retryCount: prevState.retryCount + 1,
        isRetrying: false
      }));
    }, 1000);
  }

  handleManualRetry = () => {
    // Wyczyść cache i spróbuj ponownie
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Przeładuj stronę
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isRetrying) {
        return (
          <div className="chunk-error-retry">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Ładowanie...</p>
            </div>
          </div>
        );
      }

      // Jeśli retry nie pomógł, pokaż user-friendly komunikat
      if (this.state.retryCount >= 3) {
        return (
          <div className="chunk-error-fallback">
            <div className="error-content">
              <h3>Wystąpił problem z ładowaniem</h3>
              <p>Spróbuj odświeżyć stronę lub sprawdź połączenie internetowe.</p>
              <button 
                onClick={this.handleManualRetry}
                className="retry-button"
              >
                Odśwież stronę
              </button>
            </div>
          </div>
        );
      }
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;
