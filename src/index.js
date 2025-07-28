import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./utils/debug";
import './index.css'; // Jeśli masz globalne style
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// Rejestracja Service Worker dla PWA
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('[PWA] Aplikacja gotowa do pracy offline!');
  },
  onUpdate: (registration) => {
    console.log('[PWA] Nowa wersja aplikacji dostępna!');
    // Możesz tutaj dodać logikę do pokazania notification o aktualizacji
  }
});
