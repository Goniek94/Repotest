import React from 'react';

/**
 * Responsywna karta z automatycznym dostosowaniem paddingu do różnych rozmiarów ekranu
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Zawartość karty
 * @param {string} props.padding - Rozmiar paddingu (none, sm, md, lg)
 * @param {string} props.shadow - Rozmiar cienia (none, sm, md, lg)
 * @param {string} props.rounded - Zaokrąglenie rogów (none, sm, md, lg, full)
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element}
 */
const ResponsiveCard = ({ 
  children, 
  padding = "md", 
  shadow = "md", 
  rounded = "md",
  className = "" 
}) => {
  // Mapowanie rozmiarów paddingu na klasy Tailwind
  const paddingClasses = {
    none: "p-0",
    sm: "p-2 sm:p-3",
    md: "p-3 sm:p-4 lg:p-5",
    lg: "p-4 sm:p-6 lg:p-8"
  };
  
  // Mapowanie rozmiarów cienia na klasy Tailwind
  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg"
  };
  
  // Mapowanie zaokrągleń na klasy Tailwind
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full"
  };
  
  return (
    <div className={`
      bg-white 
      ${paddingClasses[padding] || paddingClasses.md} 
      ${shadowClasses[shadow] || shadowClasses.md} 
      ${roundedClasses[rounded] || roundedClasses.md}
      border border-gray-100
      transition-shadow duration-200 hover:shadow-md
      ${className}
    `}>
      {children}
    </div>
  );
};

export default ResponsiveCard;
