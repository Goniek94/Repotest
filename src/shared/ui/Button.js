import { useResponsiveContext } from '../../contexts/ResponsiveContext';

/**
 * Responsywny komponent Button, który dostosowuje swoje właściwości w zależności od rozmiaru ekranu
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @param {string} props.className - Dodatkowe klasy CSS
 * @param {string} props.variant - Wariant przycisku (primary, secondary, outline, text, success, error, warning, info)
 * @param {string} props.size - Rozmiar przycisku (xs, sm, md, lg, xl)
 * @param {boolean} props.fullWidth - Czy przycisk ma zajmować całą szerokość
 * @param {boolean} props.disabled - Czy przycisk jest wyłączony
 * @param {boolean} props.loading - Czy przycisk jest w stanie ładowania
 * @param {React.ReactNode} props.startIcon - Ikona na początku przycisku
 * @param {React.ReactNode} props.endIcon - Ikona na końcu przycisku
 * @param {string} props.type - Typ przycisku (button, submit, reset)
 * @param {Function} props.onClick - Funkcja wywoływana po kliknięciu przycisku
 * @returns {JSX.Element} Komponent Button
 */
const Button = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size,
  fullWidth = false,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  type = 'button',
  onClick,
  ...rest 
}) => {
  const { isMobile, isTablet } = useResponsiveContext();
  
  // Określenie rozmiaru przycisku w zależności od właściwości size i rozmiaru ekranu
  const getSizeClass = () => {
    // Jeśli size jest określony, użyj go
    if (size) {
      if (size === 'xs') return 'py-1 px-2 text-xs';
      if (size === 'sm') return 'py-1.5 px-3 text-sm';
      if (size === 'md') return 'py-2 px-4 text-base';
      if (size === 'lg') return 'py-2.5 px-5 text-lg';
      if (size === 'xl') return 'py-3 px-6 text-xl';
    }
    
    // W przeciwnym razie dostosuj rozmiar do ekranu
    if (isMobile) return 'py-1.5 px-3 text-sm';
    if (isTablet) return 'py-2 px-4 text-base';
    return 'py-2 px-4 text-base';
  };
  
  // Określenie wyglądu przycisku w zależności od wariantu
  const getVariantClass = () => {
    if (variant === 'primary') {
      return 'bg-[#35530A] hover:bg-[#2a4208] text-white border border-[#35530A]';
    }
    if (variant === 'secondary') {
      return 'bg-[#6c757d] hover:bg-[#5a6268] text-white border border-[#6c757d]';
    }
    if (variant === 'outline') {
      return 'bg-transparent hover:bg-[#35530A]/10 text-[#35530A] border border-[#35530A]';
    }
    if (variant === 'text') {
      return 'bg-transparent hover:bg-[#35530A]/10 text-[#35530A] border-none';
    }
    if (variant === 'success') {
      return 'bg-green-500 hover:bg-green-600 text-white border border-green-500';
    }
    if (variant === 'error') {
      return 'bg-red-500 hover:bg-red-600 text-white border border-red-500';
    }
    if (variant === 'warning') {
      return 'bg-yellow-500 hover:bg-yellow-600 text-white border border-yellow-500';
    }
    if (variant === 'info') {
      return 'bg-blue-500 hover:bg-blue-600 text-white border border-blue-500';
    }
    return 'bg-[#35530A] hover:bg-[#2a4208] text-white border border-[#35530A]';
  };
  
  // Określenie klas dla przycisku
  const buttonClasses = `
    ${getSizeClass()}
    ${getVariantClass()}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    rounded-[2px]
    font-medium
    transition-all
    duration-200
    flex
    items-center
    justify-center
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {startIcon && !loading && (
        <span className="mr-2">{startIcon}</span>
      )}
      
      {children}
      
      {endIcon && (
        <span className="ml-2">{endIcon}</span>
      )}
    </button>
  );
};

export default Button;
