import React from 'react';

/**
 * Responsywny nagłówek H1
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Zawartość nagłówka
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element}
 */
export const Heading1 = ({ children, className = "" }) => (
  <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${className}`}>
    {children}
  </h1>
);

/**
 * Responsywny nagłówek H2
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Zawartość nagłówka
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element}
 */
export const Heading2 = ({ children, className = "" }) => (
  <h2 className={`text-xl sm:text-2xl lg:text-3xl font-semibold ${className}`}>
    {children}
  </h2>
);

/**
 * Responsywny nagłówek H3
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Zawartość nagłówka
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element}
 */
export const Heading3 = ({ children, className = "" }) => (
  <h3 className={`text-lg sm:text-xl lg:text-2xl font-medium ${className}`}>
    {children}
  </h3>
);

/**
 * Responsywny nagłówek H4
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Zawartość nagłówka
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element}
 */
export const Heading4 = ({ children, className = "" }) => (
  <h4 className={`text-base sm:text-lg lg:text-xl font-medium ${className}`}>
    {children}
  </h4>
);

/**
 * Responsywny paragraf
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Zawartość paragrafu
 * @param {string} props.size - Rozmiar tekstu (xs, sm, base, lg, xl, responsive)
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element}
 */
export const Text = ({ children, size = "base", className = "" }) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    responsive: "text-sm sm:text-base lg:text-lg"
  };
  
  return (
    <p className={`${sizeClasses[size] || sizeClasses.base} ${className}`}>
      {children}
    </p>
  );
};

/**
 * Responsywny tekst z etykietą
 * 
 * @param {Object} props
 * @param {string} props.label - Etykieta
 * @param {React.ReactNode} props.children - Zawartość
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element}
 */
export const LabeledText = ({ label, children, className = "" }) => (
  <div className={`flex flex-col sm:flex-row sm:items-center ${className}`}>
    <span className="font-medium text-gray-700 mr-2 mb-1 sm:mb-0">{label}:</span>
    <span className="text-gray-900">{children}</span>
  </div>
);
