import React from 'react';

/**
 * Komponent FormGroup do grupowania pól formularza
 * @param {Object} props - Właściwości komponentu
 * @param {string} props.label - Etykieta pola
 * @param {string} props.htmlFor - Atrybut htmlFor dla etykiety
 * @param {string} props.error - Komunikat błędu
 * @param {React.ReactNode} props.children - Zawartość grupy (pole formularza)
 * @param {string} props.className - Dodatkowe klasy CSS
 * @param {string} props.labelClassName - Dodatkowe klasy CSS dla etykiety
 * @param {string} props.helpText - Tekst pomocniczy
 * @param {boolean} props.required - Czy pole jest wymagane
 * @returns {JSX.Element} - Komponent grupy formularza
 */
function FormGroup({
  label,
  htmlFor,
  error,
  children,
  className = '',
  labelClassName = '',
  helpText,
  required = false
}) {
  const id = htmlFor || Math.random().toString(36).substring(2, 9);
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {React.cloneElement(children, { 
        id, 
        'aria-invalid': error ? 'true' : 'false',
        className: `${children.props.className || ''} ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`
      })}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default FormGroup;
