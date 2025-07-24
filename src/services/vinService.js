// vinService.js
// Legacy VIN service - redirects to new modular VIN service structure
// This file is kept for backward compatibility

// Import the new modular VIN service
import vinService from './vin/index.js';

/**
 * Legacy function - redirects to new VIN service
 * @deprecated Use vinService from './vin/index.js' instead
 */
export const lookupVin = vinService.lookupVin;

// Export default for backward compatibility
export default vinService;
