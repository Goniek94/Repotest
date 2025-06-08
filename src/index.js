import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./utils/debug";
import './index.css'; // Jeśli masz globalne style

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
