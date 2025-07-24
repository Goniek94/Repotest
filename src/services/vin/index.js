// VIN Service - Main entry point
// Centralized service for VIN number lookup and vehicle data decoding

import { lookupVin } from './vinLookup';
import { decodeVin } from './vinDecoder';
import { getManufacturerFromWMI } from './manufacturerMapping';
import { getEngineData } from './engineData';
import { getVehicleStatus } from './vehicleStatus';

/**
 * Main VIN service interface
 * Provides a clean API for VIN-related operations
 */
const vinService = {
  // Main lookup function
  lookupVin,
  
  // Individual decoder functions
  decodeVin,
  getManufacturerFromWMI,
  getEngineData,
  getVehicleStatus,
  
  // Utility functions
  validateVin: (vin) => {
    return vin && typeof vin === 'string' && vin.length === 17;
  },
  
  // Format VIN for display
  formatVin: (vin) => {
    if (!vin || vin.length !== 17) return vin;
    return `${vin.substring(0, 3)}-${vin.substring(3, 9)}-${vin.substring(9, 17)}`;
  }
};

export default vinService;

// Named exports for direct access
export {
  lookupVin,
  decodeVin,
  getManufacturerFromWMI,
  getEngineData,
  getVehicleStatus
};
