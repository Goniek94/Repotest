// SearchForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicFilters from "./BasicFilters";
import AdvancedFilters from "./AdvancedFilters";
import SearchFormButtons from "./SearchFormButtons";
import { carData, bodyTypes, advancedOptions, regions } from "./SearchFormConstants";
import AdsService from "../../services/ads";

/**
 * SearchForm component
 * @param {object} props
 * @param {object} props.initialValues - initial form values
 * @param {function} [props.onFilterChange] - callback to pass filters to parent
 */
export default function SearchForm({ initialValues = {}, onFilterChange }) {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState(() => ({
    make: '',
    model: '',
    priceFrom: '',
    priceTo: '',
    yearFrom: '',
    yearTo: '',
    bodyType: '',
    damageStatus: '',
    country: '',
    region: '',
    fuelType: '',
    driveType: '',
    mileageFrom: '',
    mileageTo: '',
    location: '',
    transmission: '',
    enginePowerFrom: '',
    enginePowerTo: '',
    engineCapacityFrom: '',
    engineCapacityTo: '',
    color: '',
    doorCount: '',
    tuning: '',
    vehicleCondition: '',
    sellingForm: '',
    sellerType: '',
    vat: false,
    invoiceOptions: false,
    ...initialValues
  }));

  // Available models for selected make
  const [availableModels, setAvailableModels] = useState([]);

  // Show advanced filters
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Real matching results from backend
  const [matchingResults, setMatchingResults] = useState(0);

  // Update available models when make changes
  useEffect(() => {
    if (formData.make && carData[formData.make]) {
      setAvailableModels(carData[formData.make]);
    } else {
      setAvailableModels([]);
    }
  }, [formData.make]);

  // Fetch real count from backend on filter change
  useEffect(() => {
    let ignore = false;
    const fetchCount = async () => {
      try {
        const params = { ...formData };
        // Remove empty values
        Object.keys(params).forEach(
          (key) =>
            (params[key] === '' || params[key] === null || params[key] === undefined) &&
            delete params[key]
        );
        const res = await AdsService.getCount(params);
        if (!ignore) setMatchingResults(res.data.count || 0);
      } catch (e) {
        if (!ignore) setMatchingResults(0);
      }
    };
    fetchCount();
    return () => {
      ignore = true;
    };
  }, [formData]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      let finalValue = value;
      if (
        [
          'priceFrom',
          'priceTo',
          'mileageFrom',
          'mileageTo',
          'enginePowerFrom',
          'enginePowerTo',
          'engineCapacityFrom',
          'engineCapacityTo'
        ].includes(name)
      ) {
        if (Number(value) < 0) finalValue = 0;
      }
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    }
  };

  // Handle search button
  const handleSearch = () => {
    if (onFilterChange) {
      onFilterChange(formData);
    } else {
      const searchParams = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          if (typeof value === 'boolean') {
            searchParams.append(key, value.toString());
          } else {
            searchParams.append(key, value);
          }
        }
      });
      navigate(`/listings?${searchParams.toString()}`);
    }
  };

  // Generate year options
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);
  };

  return (
    <section className="bg-[#F5F7F9] py-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#35530A] text-center mb-5 uppercase">
          Wyszukaj pojazd
        </h2>
        <div className="bg-white p-5 shadow-md rounded-[2px] mb-4">
          <BasicFilters
            formData={formData}
            handleInputChange={handleInputChange}
            carData={carData}
            bodyTypes={bodyTypes}
            availableModels={availableModels}
            generateYearOptions={generateYearOptions}
            advancedOptions={advancedOptions}
            regions={regions}
          />
          {showAdvanced && (
            <AdvancedFilters
              formData={formData}
              handleInputChange={handleInputChange}
              advancedOptions={advancedOptions}
              regions={regions}
            />
          )}
          <SearchFormButtons
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            handleSearch={handleSearch}
            matchingResults={matchingResults}
          />
        </div>
      </div>
    </section>
  );
}