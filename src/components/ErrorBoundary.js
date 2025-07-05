import React from 'react';
import { safeConsole } from '../utils/debug';

/**
 * Komponent ErrorBoundary do obsługi błędów w aplikacji
 * Pozwala na wyświetlenie przyjaznego komunikatu błędu użytkownikowi
 * zamiast białego ekranu z czerwonym komunikatem błędu
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  // Przechwytywanie błędów renderowania
  static getDerivedStateFromError(error) {
    // Aktualizacja stanu, aby następny render pokazał UI awaryjne
    return { hasError: true };
  }

  // Zapisywanie szczegółów błędu
  componentDidCatch(error, errorInfo) {
    // Logowanie błędu do serwisu monitorowania (w tym przypadku tylko do konsoli)
    safeConsole.error('ErrorBoundary przechwycił błąd:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Tutaj w przyszłości można dodać wysyłanie błędu do serwisu monitorowania np. Sentry
  }

  // Resetowanie stanu błędu przy zmianie ścieżki
  componentDidUpdate(prevProps) {
    const currentPathname = window.location.pathname;
    
    if (this.state.hasError && this.lastPathname !== currentPathname) {
      this.setState({ 
        hasError: false,
        error: null,
        errorInfo: null
      });
      this.lastPathname = currentPathname;
    }
  }

  render() {
    if (this.state.hasError) {
      // Interfejs użytkownika w przypadku błędu
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Ups! Coś poszło nie tak
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Przepraszamy, wystąpił nieoczekiwany błąd.
              </p>
            </div>
            <div className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm p-4 bg-white border border-gray-200">
                <p className="text-gray-700 mb-4">
                  Możesz spróbować:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Odświeżyć stronę</li>
                  <li>Wrócić do <a href="/" className="text-green-600 hover:text-green-800">strony głównej</a></li>
                  <li>Wyczyścić pamięć podręczną przeglądarki</li>
                  <li>Wylogować się i zalogować ponownie</li>
                </ul>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => window.location.reload()}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Odśwież stronę
                </button>
                <a
                  href="/"
                  className="mt-3 inline-block font-medium text-sm text-green-600 hover:text-green-800"
                >
                  Wróć do strony głównej
                </a>
              </div>
              
              {process.env.NODE_ENV !== 'production' && this.state.error && (
                <div className="mt-6 rounded-md bg-red-50 p-4 border border-red-100">
                  <h3 className="text-sm font-medium text-red-800">Szczegóły błędu (widoczne tylko w trybie deweloperskim):</h3>
                  <div className="mt-2 text-sm text-red-700 overflow-auto max-h-32">
                    <p>{this.state.error.toString()}</p>
                    <pre className="mt-2 text-xs">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Normalny render, gdy nie ma błędu
    return this.props.children;
  }
}

export default ErrorBoundary;
