// src/services/client.js
// Reeksportujemy bardziej rozbudowaną wersję apiClient z podkatalogu api
// Zapewnia to wsteczną kompatybilność z kodem, który importuje z ./services/client.js

import apiClient from './api/client';
import debugUtils from '../utils/debug';

const { safeConsole } = debugUtils;

// Informacja o tym, że klient jest przestarzały
if (process.env.NODE_ENV === 'development') {
  safeConsole.warn(
    'Importowanie z "services/client.js" jest przestarzałe. ' +
    'Zalecamy bezpośredni import z "services/api/client.js".'
  );
}

export default apiClient;
