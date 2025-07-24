/**
 * Skrypt do czyszczenia cache przeglądarki
 * Usuwa dane z localStorage i sessionStorage
 */

// Funkcja do czyszczenia cache
function clearBrowserCache() {
  try {
    // Usuń dane z localStorage
    localStorage.removeItem('carData');
    console.log('✅ Wyczyszczono cache danych o samochodach z localStorage');
    
    // Usuń inne dane z localStorage, które mogą wpływać na wyszukiwarkę
    localStorage.removeItem('searchFormData');
    localStorage.removeItem('lastSearch');
    localStorage.removeItem('searchHistory');
    
    // Wyświetl komunikat o sukcesie
    document.getElementById('status').textContent = 'Cache został wyczyszczony! Odśwież stronę, aby pobrać nowe dane.';
    document.getElementById('status').className = 'success';
    
    // Dodaj przycisk do odświeżenia strony
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Odśwież stronę';
    refreshButton.className = 'refresh-button';
    refreshButton.onclick = () => window.location.reload();
    document.getElementById('actions').appendChild(refreshButton);
    
  } catch (error) {
    console.error('❌ Błąd podczas czyszczenia cache:', error);
    document.getElementById('status').textContent = 'Wystąpił błąd podczas czyszczenia cache: ' + error.message;
    document.getElementById('status').className = 'error';
  }
}

// Funkcja do sprawdzenia zawartości localStorage
function checkLocalStorage() {
  try {
    const carData = localStorage.getItem('carData');
    
    if (carData) {
      const parsedData = JSON.parse(carData);
      const brands = Object.keys(parsedData);
      
      document.getElementById('storage-info').innerHTML = `
        <h3>Dane w localStorage:</h3>
        <p>Liczba marek: ${brands.length}</p>
        <p>Marki: ${brands.join(', ')}</p>
      `;
    } else {
      document.getElementById('storage-info').innerHTML = `
        <h3>Dane w localStorage:</h3>
        <p>Brak danych o samochodach w localStorage</p>
      `;
    }
  } catch (error) {
    console.error('❌ Błąd podczas sprawdzania localStorage:', error);
    document.getElementById('storage-info').innerHTML = `
      <h3>Dane w localStorage:</h3>
      <p>Błąd podczas sprawdzania: ${error.message}</p>
    `;
  }
}

// Inicjalizacja po załadowaniu strony
window.onload = function() {
  // Dodaj obsługę przycisku do czyszczenia cache
  document.getElementById('clear-cache').addEventListener('click', clearBrowserCache);
  
  // Dodaj obsługę przycisku do sprawdzania localStorage
  document.getElementById('check-storage').addEventListener('click', checkLocalStorage);
  
  // Sprawdź localStorage na starcie
  checkLocalStorage();
};
