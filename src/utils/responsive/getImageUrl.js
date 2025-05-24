/**
 * Zwraca poprawny URL do zdjęcia (z /uploads/), obsługuje http, https, brak zdjęcia.
 * @param {string} image - ścieżka lub URL do zdjęcia
 * @returns {string} - poprawny URL do zdjęcia
 */
const getImageUrl = (image) => {
  if (!image) return "/images/placeholder.jpg";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/uploads/")) return image;
  if (image.startsWith("uploads/")) return "/" + image;
  return "/uploads/" + image.replace(/^\/?/, "");
};

export default getImageUrl;
