import React, { useState, useEffect } from 'react';
import { installPWA, isPWAInstalled } from '../serviceWorkerRegistration';

const PWAInstallButton = () => {
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Sprawdź czy aplikacja jest już zainstalowana
    setIsInstalled(isPWAInstalled());

    // Nasłuchuj na event o dostępności instalacji
    const handleInstallAvailable = () => {
      if (!isPWAInstalled()) {
        setShowInstallButton(true);
      }
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);

    // Sprawdź po 3 sekundach czy można pokazać przycisk
    const timer = setTimeout(() => {
      if (!isPWAInstalled() && 'serviceWorker' in navigator) {
        setShowInstallButton(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    try {
      await installPWA();
      setShowInstallButton(false);
      setIsInstalled(true);
    } catch (error) {
      console.error('Błąd instalacji PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    // Zapamiętaj że użytkownik odrzucił instalację
    localStorage.setItem('marketplace-install-dismissed', 'true');
  };

  // Nie pokazuj jeśli aplikacja jest zainstalowana lub użytkownik odrzucił
  if (isInstalled || localStorage.getItem('marketplace-install-dismissed') === 'true') {
    return null;
  }

  if (!showInstallButton) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-[#35530A] rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📱</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900">
              Zainstaluj Marketplace
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Dodaj aplikację do ekranu głównego dla szybszego dostępu
            </p>
            
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleInstall}
                className="bg-[#35530A] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-[#2a4208] transition-colors"
              >
                Zainstaluj
              </button>
              <button
                onClick={handleDismiss}
                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                Nie teraz
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallButton;
