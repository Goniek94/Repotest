import React from 'react';

/**
 * Komponent Card do wyświetlania zawartości w formie karty
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Zawartość karty
 * @param {React.ReactNode} props.header - Nagłówek karty
 * @param {React.ReactNode} props.footer - Stopka karty
 * @param {string} props.className - Dodatkowe klasy CSS dla karty
 * @param {string} props.headerClassName - Dodatkowe klasy CSS dla nagłówka
 * @param {string} props.bodyClassName - Dodatkowe klasy CSS dla zawartości
 * @param {string} props.footerClassName - Dodatkowe klasy CSS dla stopki
 * @returns {JSX.Element} - Komponent karty
 */
function Card({
  children,
  header,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  ...rest
}) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 ${className}`}
      {...rest}
    >
      {header && (
        <div className={`bg-gray-50 px-5 py-3 border-b border-gray-200 ${headerClassName}`}>
          {header}
        </div>
      )}
      
      <div className={`p-5 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`bg-gray-50 px-5 py-3 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
