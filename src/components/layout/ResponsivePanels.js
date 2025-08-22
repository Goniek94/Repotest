import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import useResponsiveLayout from '../../hooks/useResponsiveLayout';

/**
 * 📱 RESPONSIVE PANELS
 * 
 * Uniwersalny system paneli responsywnych
 * - Mobile: jeden panel na raz z nawigacją
 * - Tablet/Desktop: wszystkie panele obok siebie
 */
const ResponsivePanels = ({ 
  panels = [], 
  className = '',
  equalWidth = true,
  showNavigation = true 
}) => {
  const { isMobile, isStackLayout, equalPanelsClass, getFlexDirection } = useResponsiveLayout();
  const [activePanelIndex, setActivePanelIndex] = useState(0);

  // Mobile navigation handlers
  const goToPanel = (index) => {
    setActivePanelIndex(index);
  };

  const goBack = () => {
    if (activePanelIndex > 0) {
      setActivePanelIndex(activePanelIndex - 1);
    }
  };

  const goForward = () => {
    if (activePanelIndex < panels.length - 1) {
      setActivePanelIndex(activePanelIndex + 1);
    }
  };

  // Render mobile navigation
  const renderMobileNavigation = () => {
    if (!isMobile || !showNavigation || panels.length <= 1) return null;

    const currentPanel = panels[activePanelIndex];
    
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <button
          onClick={goBack}
          disabled={activePanelIndex === 0}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Wstecz
        </button>
        
        <div className="text-sm font-medium text-gray-900">
          {currentPanel?.title || `Panel ${activePanelIndex + 1}`}
        </div>
        
        <div className="text-xs text-gray-500">
          {activePanelIndex + 1} / {panels.length}
        </div>
      </div>
    );
  };

  // Render panels
  const renderPanels = () => {
    if (isMobile) {
      // Mobile: show only active panel
      const activePanel = panels[activePanelIndex];
      if (!activePanel) return null;

      return (
        <div className="flex-1 overflow-hidden">
          {activePanel.content}
        </div>
      );
    }

    // Desktop/Tablet: show all panels
    return (
      <div className={`flex ${getFlexDirection()} h-full overflow-hidden`}>
        {panels.map((panel, index) => (
          <div
            key={panel.key || index}
            className={`
              ${equalWidth ? equalPanelsClass : panel.className || 'flex-1'}
              ${index < panels.length - 1 ? 'border-r border-gray-200' : ''}
              overflow-hidden
            `}
          >
            {panel.content}
          </div>
        ))}
      </div>
    );
  };

  // Render breadcrumbs for mobile
  const renderBreadcrumbs = () => {
    if (!isMobile || !showNavigation || panels.length <= 1) return null;

    return (
      <div className="flex items-center gap-1 px-4 py-2 bg-white border-b text-xs text-gray-500">
        {panels.map((panel, index) => (
          <React.Fragment key={panel.key || index}>
            <button
              onClick={() => goToPanel(index)}
              className={`
                px-2 py-1 rounded transition-colors
                ${index === activePanelIndex 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'hover:bg-gray-100'
                }
              `}
            >
              {panel.title || `Panel ${index + 1}`}
            </button>
            {index < panels.length - 1 && (
              <span className="text-gray-300">›</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {renderMobileNavigation()}
      {renderBreadcrumbs()}
      {renderPanels()}
    </div>
  );
};

export default ResponsivePanels;
