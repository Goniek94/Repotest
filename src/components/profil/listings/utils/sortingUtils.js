/**
 * Utility functions for sorting listings
 * Contains sorting logic and helper functions
 */

// Status priority order for sorting
export const STATUS_ORDER = {
  'active': 1,
  'pending': 2,
  'needs_changes': 3,
  'archived': 4,
  'sold': 5
};

/**
 * Get sort value for a listing based on sort field
 * @param {Object} listing - The listing object
 * @param {string} sortBy - The field to sort by
 * @returns {any} - The value to sort by
 */
export const getSortValue = (listing, sortBy) => {
  console.log('🔍 getSortValue dla:', { sortBy, listing: { 
    _id: listing._id, 
    brand: listing.brand, 
    model: listing.model, 
    price: listing.price,
    createdAt: listing.createdAt,
    views: listing.views,
    status: listing.status
  }});
  
  let value;
  switch (sortBy) {
    case 'createdAt':
      // Sprawdź różne możliwe nazwy pól dla daty
      value = new Date(listing.createdAt || listing.created_at || listing.dateCreated || 0);
      break;
    case 'price':
      // Sprawdź różne możliwe nazwy pól dla ceny
      value = listing.price || listing.cena || listing.priceValue || 0;
      break;
    case 'title':
      // Sprawdź różne możliwe nazwy pól dla tytułu
      const brand = listing.brand || listing.marka || '';
      const model = listing.model || listing.modelName || '';
      value = `${brand} ${model}`.trim().toLowerCase();
      break;
    case 'views':
      // Sprawdź różne możliwe nazwy pól dla wyświetleń
      value = listing.views || listing.viewCount || listing.wyswietlenia || 0;
      break;
    case 'status':
      value = STATUS_ORDER[listing.status] || 999;
      break;
    default:
      value = 0;
  }
  
  console.log('📊 Wartość sortowania:', { sortBy, value });
  return value;
};

/**
 * Compare two values for sorting
 * @param {any} aValue - First value
 * @param {any} bValue - Second value
 * @param {string} sortBy - Sort field type
 * @param {string} sortOrder - Sort order ('asc' or 'desc')
 * @returns {number} - Comparison result
 */
export const compareValues = (aValue, bValue, sortBy, sortOrder) => {
  if (sortBy === 'title') {
    // String comparison with Polish locale
    if (sortOrder === 'asc') {
      return aValue.localeCompare(bValue, 'pl');
    } else {
      return bValue.localeCompare(aValue, 'pl');
    }
  } else {
    // Numeric/Date comparison
    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  }
};

/**
 * Sort listings array
 * @param {Array} listings - Array of listings to sort
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order ('asc' or 'desc')
 * @returns {Array} - Sorted array
 */
export const sortListings = (listings, sortBy, sortOrder) => {
  console.log('🔄 SORTOWANIE ROZPOCZĘTE:', { sortBy, sortOrder, count: listings.length });
  
  // Debug: sprawdź strukturę pierwszego ogłoszenia
  if (listings.length > 0) {
    console.log('📋 STRUKTURA PIERWSZEGO OGŁOSZENIA:', {
      id: listings[0]._id,
      brand: listings[0].brand,
      model: listings[0].model,
      price: listings[0].price,
      createdAt: listings[0].createdAt,
      views: listings[0].views,
      status: listings[0].status,
      allKeys: Object.keys(listings[0])
    });
  }
  
  const sorted = [...listings].sort((a, b) => {
    const aValue = getSortValue(a, sortBy);
    const bValue = getSortValue(b, sortBy);
    const result = compareValues(aValue, bValue, sortBy, sortOrder);
    
    // Debug dla pierwszych kilku porównań
    if (listings.indexOf(a) < 2 && listings.indexOf(b) < 2) {
      console.log('📊 SZCZEGÓŁOWE PORÓWNANIE:', {
        sortBy,
        sortOrder,
        a: { 
          id: a._id, 
          brand: a.brand, 
          model: a.model, 
          price: a.price, 
          createdAt: a.createdAt,
          value: aValue 
        },
        b: { 
          id: b._id, 
          brand: b.brand, 
          model: b.model, 
          price: b.price, 
          createdAt: b.createdAt,
          value: bValue 
        },
        result
      });
    }
    
    return result;
  });
  
  console.log('✅ SORTOWANIE ZAKOŃCZONE - pierwsze 3 elementy:', 
    sorted.slice(0, 3).map(item => ({
      id: item._id,
      brand: item.brand,
      model: item.model,
      price: item.price,
      sortValue: getSortValue(item, sortBy)
    }))
  );
  
  return sorted;
};

/**
 * Get available sort options
 * @returns {Array} - Array of sort options
 */
export const getSortOptions = () => [
  { value: 'createdAt', label: 'Data utworzenia' },
  { value: 'price', label: 'Cena' },
  { value: 'title', label: 'Tytuł' },
  { value: 'views', label: 'Wyświetlenia' },
  { value: 'status', label: 'Status' }
];

/**
 * Get sort order options
 * @returns {Array} - Array of sort order options
 */
export const getSortOrderOptions = () => [
  { value: 'desc', label: 'Malejąco' },
  { value: 'asc', label: 'Rosnąco' }
];

/**
 * Validate sort parameters
 * @param {string} sortBy - Sort field
 * @param {string} sortOrder - Sort order
 * @returns {boolean} - Whether parameters are valid
 */
export const validateSortParams = (sortBy, sortOrder) => {
  const validSortFields = getSortOptions().map(option => option.value);
  const validSortOrders = getSortOrderOptions().map(option => option.value);
  
  return validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder);
};

/**
 * Get default sort configuration
 * @returns {Object} - Default sort config
 */
export const getDefaultSortConfig = () => ({
  sortBy: 'createdAt',
  sortOrder: 'desc'
});
