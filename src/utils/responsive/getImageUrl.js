/**
 * Zwraca poprawny URL do zdjęcia (z /uploads/), obsługuje http, https, brak zdjęcia.
 * @param {string} image - ścieżka lub URL do zdjęcia
 * @returns {string} - poprawny URL do zdjęcia
 */
const getImageUrl = (image) => {
  if (!image) return "/images/placeholder.jpg";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  // Pobierz host backendu z env lub użyj domyślnego adresu
  // Używamy bezpośrednio baseUrl z konfiguracji API
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  
  console.log("getImageUrl - image:", image);
  console.log("getImageUrl - apiUrl:", apiUrl);

  // Upewnij się, że ścieżka jest poprawnie sformatowana
  if (image.startsWith("/uploads/")) {
    const fullUrl = apiUrl + image;
    console.log("getImageUrl - fullUrl (1):", fullUrl);
    return fullUrl;
  }
  
  if (image.startsWith("uploads/")) {
    const fullUrl = apiUrl + "/" + image;
    console.log("getImageUrl - fullUrl (2):", fullUrl);
    return fullUrl;
  }
  
  const fullUrl = apiUrl + "/uploads/" + image.replace(/^\/?/, "");
  console.log("getImageUrl - fullUrl (3):", fullUrl);
  return fullUrl;
};

export default getImageUrl;
