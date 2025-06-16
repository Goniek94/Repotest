import React from 'react';

/**
 * Responsywny kontener, który automatycznie dostosowuje się do różnych rozmiarów ekranu
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Zawartość kontenera
 * @param {boolean} props.fluid - Czy kontener ma być pełnej szerokości (true) czy z maksymalną szerokością (false)
 * @param {string} props.className - Dodatkowe klasy CSS
 * @param {string} props.as - Element HTML, który ma być użyty (domyślnie div)
 * @returns {JSX.Element}
 */
const ResponsiveContainer = ({ 
  children, 
  fluid = false, 
  className = "", 
  as: Component = 'div' 
}) => {
  return (
    <Component className={`
      mx-auto 
      px-2 sm:px-4 lg:px-6 
      ${fluid ? 'w-full' : 'max-w-7xl'} 
      ${className}
    `}>
      {children}
    </Component>
  );
};

export default ResponsiveContainer;
