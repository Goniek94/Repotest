import React from 'react';
import PropTypes from 'prop-types';

/**
 * Komponenty pomocnicze dla formularzy
 */

// Pole select
export const Select = ({ id, name, value, onChange, options = [], placeholder, label, className = '' }) => (
  <div>
    {label && <label htmlFor={id} className="block text-base font-semibold text-gray-700 mb-1">{label}</label>}
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full h-11 text-base px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] ${className}`}
      aria-label={label || placeholder}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={typeof opt === 'object' ? opt.value : opt} value={typeof opt === 'object' ? opt.value : opt}>
          {typeof opt === 'object' ? opt.label : opt}
        </option>
      ))}
    </select>
  </div>
);

// Pole input
export const Input = ({ id, name, type = 'text', value, onChange, placeholder, label, min, className = '' }) => (
  <div>
    {label && <label htmlFor={id} className="block text-base font-semibold text-gray-700 mb-1">{label}</label>}
    <input
      id={id}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      className={`w-full h-11 text-base px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] ${className}`}
      aria-label={label || placeholder}
    />
  </div>
);

// Zakres (od-do)
export const RangeInputs = ({ nameFrom, nameTo, valueFrom, valueTo, onChange, label, type = 'number', min }) => (
  <div>
    {label && <label className="block text-base font-semibold text-gray-700 mb-1">{label}</label>}
    <div className="grid grid-cols-2 gap-2">
      <input
        type={type}
        name={nameFrom}
        placeholder="Od"
        min={min}
        value={valueFrom}
        onChange={onChange}
        className="w-full h-11 text-base px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
        aria-label={`${label} od`}
      />
      <input
        type={type}
        name={nameTo}
        placeholder="Do"
        min={min}
        value={valueTo}
        onChange={onChange}
        className="w-full h-11 text-base px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
        aria-label={`${label} do`}
      />
    </div>
  </div>
);

// Grupa radio - zmodyfikowana na prostokąty
export const RadioGroup = ({ name, options = [], value, onChange, label, inline = true }) => (
  <div>
    {label && <label className="block text-base font-semibold text-gray-700 mb-1">{label}</label>}
    <div 
      className={`grid ${inline ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mt-2`} 
      role="radiogroup" 
      aria-label={label}
    >
      {options.map(opt => (
        <div 
          key={opt.value} 
          className={`
            cursor-pointer border rounded-[2px] px-3 py-2 text-center transition-all
            ${value === opt.value 
              ? 'bg-[#F5F7F9] border-[#35530A] border-2 font-medium' 
              : 'border-gray-300 hover:bg-gray-50'
            }
          `}
          onClick={() => onChange({ target: { name, value: opt.value } })}
        >
          <input
            type="radio"
            id={`${name}-${opt.value}`}
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
            className="sr-only" // Ukrywamy oryginalny input radio
            aria-label={`${label} - ${opt.label}`}
          />
          <label 
            htmlFor={`${name}-${opt.value}`} 
            className="text-base cursor-pointer w-full h-full block"
          >
            {opt.label}
          </label>
        </div>
      ))}
    </div>
  </div>
);

// Checkbox
export const Checkbox = ({ id, name, checked, onChange, label }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      onChange={onChange}
      className="mr-2 h-4 w-4"
      aria-label={label}
    />
    <label htmlFor={id} className="text-base font-medium">{label}</label>
  </div>
);

// Propsy
Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string
};

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string
};

RangeInputs.propTypes = {
  nameFrom: PropTypes.string.isRequired,
  nameTo: PropTypes.string.isRequired,
  valueFrom: PropTypes.any,
  valueTo: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  inline: PropTypes.bool
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};
