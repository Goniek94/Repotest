// src/services/rotationService.js
import Ad from '../models/Ad.js';

// Serwis do rotacji ogłoszeń na stronie głównej
const rotationService = {
  // Pamięć podręczna
  cache: {
    featured: null,
    hot: null,
    regular: null,
    lastRotation: null
  },
  
  // Interwał rotacji w milisekundach (12 godzin)
  rotationInterval: 12 * 60 * 60 * 1000,
  
  // Sprawdza, czy należy wykonać nową rotację
  shouldRotate() {
    const now = new Date();
    if (!this.cache.lastRotation) return true;
    
    return (now - this.cache.lastRotation) > this.rotationInterval;
  },
  
  // Pobiera losowe ogłoszenia do wyświetlenia na stronie głównej
  async getRotatedListings() {
    try {
      // Jeśli mamy dane w cache i nie trzeba robić rotacji, zwracamy je
      if (!this.shouldRotate() && this.cache.featured) {
        return {
          featured: this.cache.featured,
          hot: this.cache.hot,
          regular: this.cache.regular,
          nextRotationTime: new Date(this.cache.lastRotation.getTime() + this.rotationInterval)
        };
      }
      
      // Pobieramy wszystkie opublikowane ogłoszenia
      const allAds = await Ad.find({
        status: 'opublikowane'
      }).sort({ createdAt: -1 }).limit(100);
      
      // Dzielimy na wyróżnione i standardowe
      const featuredAds = allAds.filter(ad => ad.listingType === 'wyróżnione');
      const standardAds = allAds.filter(ad => ad.listingType === 'standardowe');
      
      // Losowe wybieranie ogłoszeń
      const getRandomAds = (ads, count) => {
        if (!ads || ads.length === 0) return [];
        if (ads.length <= count) return ads;
        
        const shuffled = [...ads];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled.slice(0, count);
      };
      
      // Wybieramy ogłoszenia do poszczególnych sekcji
      const featured = getRandomAds(featuredAds, 2); // 2 główne wyróżnione
      
      // Wybieramy "gorące oferty" z pozostałych wyróżnionych ogłoszeń
      const remainingFeatured = featuredAds.filter(
        ad => !featured.some(f => f._id.toString() === ad._id.toString())
      );
      const hot = getRandomAds(remainingFeatured, 4); // 4 "gorące oferty"
      
      // Wybieramy standardowe ogłoszenia
      const regular = getRandomAds(standardAds, 6); // 6 zwykłych ogłoszeń
      
      // Aktualizujemy cache
      this.cache.featured = featured;
      this.cache.hot = hot;
      this.cache.regular = regular;
      this.cache.lastRotation = new Date();
      
      return {
        featured,
        hot,
        regular,
        nextRotationTime: new Date(this.cache.lastRotation.getTime() + this.rotationInterval)
      };
    } catch (error) {
      console.error('Błąd podczas rotacji ogłoszeń:', error);
      throw error;
    }
  },
  
  // Wymusza nową rotację (czyszcząc cache)
  forceRotation() {
    this.cache.featured = null;
    this.cache.hot = null;
    this.cache.regular = null;
    this.cache.lastRotation = null;
  }
};

export default rotationService;