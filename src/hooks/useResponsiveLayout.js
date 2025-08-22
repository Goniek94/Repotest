import useResponsive from './useResponsive';

/**
 * 📱 RESPONSIVE LAYOUT HOOK
 * 
 * Rozszerzony hook responsywności z predefiniowanymi klasami layoutu
 * dla spójności w całej aplikacji
 */
const useResponsiveLayout = () => {
  const responsive = useResponsive();

  // Standardowe klasy kontenerów
  const containerClasses = {
    main: "w-full max-w-7xl mx-auto",
    padding: responsive.isMobile ? "px-4" : responsive.isTablet ? "px-6" : "px-8",
    section: "mb-6 md:mb-8 lg:mb-10"
  };

  // Standardowe klasy paneli
  const panelClasses = {
    // Równe panele - główny system
    equal: {
      mobile: "w-full mb-4",
      tablet: "w-1/2 px-2",
      desktop: "w-1/3 px-3"
    },
    
    // Panele z różnymi proporcjami
    sidebar: {
      mobile: "w-full mb-4",
      tablet: "w-1/3 px-2", 
      desktop: "w-1/4 px-3"
    },
    
    main: {
      mobile: "w-full",
      tablet: "w-2/3 px-2",
      desktop: "w-3/4 px-3"
    }
  };

  // Grid system
  const gridClasses = {
    cols: responsive.isMobile ? "grid-cols-1" : 
          responsive.isTablet ? "grid-cols-2" : "grid-cols-3",
    gap: responsive.isMobile ? "gap-4" : "gap-6",
    responsive: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  };

  // Wysokości sekcji
  const heightClasses = {
    section: responsive.isMobile ? "min-h-[400px]" : "min-h-[600px]",
    fullSection: "min-h-[calc(100vh-200px)]",
    panel: responsive.isMobile ? "h-auto" : "h-[600px]"
  };

  // Funkcje pomocnicze
  const getPanelClass = (type = 'equal') => {
    const classes = panelClasses[type];
    if (responsive.isMobile) return classes.mobile;
    if (responsive.isTablet) return classes.tablet;
    return classes.desktop;
  };

  const getFlexDirection = () => {
    return responsive.isMobile ? "flex-col" : "flex-row";
  };

  const getTextSize = () => {
    return {
      title: responsive.isMobile ? "text-xl" : "text-2xl lg:text-3xl",
      subtitle: responsive.isMobile ? "text-sm" : "text-base",
      body: responsive.isMobile ? "text-sm" : "text-base"
    };
  };

  return {
    // Podstawowe responsive data
    ...responsive,
    
    // Klasy CSS
    container: containerClasses,
    panel: panelClasses,
    grid: gridClasses,
    height: heightClasses,
    text: getTextSize(),
    
    // Funkcje pomocnicze
    getPanelClass,
    getFlexDirection,
    
    // Często używane kombinacje
    equalPanelsClass: getPanelClass('equal'),
    sidebarClass: getPanelClass('sidebar'),
    mainContentClass: getPanelClass('main'),
    
    // Layout helpers
    isStackLayout: responsive.isMobile,
    showSidebar: !responsive.isMobile,
    panelsPerRow: responsive.isMobile ? 1 : responsive.isTablet ? 2 : 3
  };
};

export default useResponsiveLayout;
