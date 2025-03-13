import React, { useState, useEffect } from 'react';

const ResponsiveWrapper = ({ children, className }) => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false
  });

  const updateScreenSize = () => {
    const width = window.innerWidth;
    setScreenSize({
      isMobile: width < 640,
      isTablet: width >= 640 && width < 768,
      isLaptop: width >= 768 && width < 1024,
      isDesktop: width >= 1024
    });
  };

  useEffect(() => {
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  return (
    <div 
      className={`responsive-wrapper ${className}`}
      data-device={
        screenSize.isMobile ? 'mobile' : 
        screenSize.isTablet ? 'tablet' : 
        screenSize.isLaptop ? 'laptop' : 
        'desktop'
      }
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { screenSize });
        }
        return child;
      })}
    </div>
  );
};

export default ResponsiveWrapper;