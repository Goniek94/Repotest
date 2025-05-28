/**
 * Zwraca poprawny URL do zdjęcia (z /uploads/), obsługuje http, https, brak zdjęcia.
 * @param {string} image - ścieżka lub URL do zdjęcia
 * @returns {string} - poprawny URL do zdjęcia
 */
const getImageUrl = (image) => {
  if (!image) return "/images/placeholder.jpg";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  // Pobierz host backendu z env
  const apiUrl = process.env.REACT_APP_API_URL || "";

  if (image.startsWith("/uploads/")) return apiUrl + image;
  if (image.startsWith("uploads/")) return apiUrl + "/" + image;
  return apiUrl + "/uploads/" + image.replace(/^\/?/, "");
};

export default getImageUrl;
