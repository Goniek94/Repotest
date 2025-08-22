import React from 'react';
import useResponsiveLayout from '../../hooks/useResponsiveLayout';

/**
 * 📦 RESPONSIVE CONTAINER
 * 
 * Uniwersalny kontener responsywny dla całej aplikacji
 * Zapewnia spójne marginesy, padding i max-width
 */
const ResponsiveContainer = ({ 
  children, 
  className = '', 
  noPadding = false,
  fullHeight = false 
}) => {
  const { container, height } = useResponsiveLayout();

  const containerClass = `
    ${container.main}
    ${!noPadding ? container.padding : ''}
    ${fullHeight ? height.fullSection : ''}
    ${className}
  `.trim();

  return (
    <div className={containerClass}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
