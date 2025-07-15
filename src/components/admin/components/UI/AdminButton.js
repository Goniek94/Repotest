import React from 'react';

const AdminButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick = null,
  type = 'button',
  className = '',
  icon: Icon = null,
  iconPosition = 'left',
  fullWidth = false
}) => {
  const getVariantClasses = (variant) => {
    switch (variant) {
      case 'primary':
        return 'bg-white text-white hover:opacity-90 focus:ring-green-500';
      case 'secondary':
        return 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500';
      case 'success':
        return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500';
      case 'info':
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
      case 'ghost':
        return 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500';
      default:
        return 'bg-white text-white hover:opacity-90 focus:ring-green-500';
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-sm';
      case 'medium':
        return 'px-4 py-2 text-sm';
      case 'large':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);

  const buttonStyle = variant === 'primary' ? { backgroundColor: '#35530A' } : {};

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  const renderIcon = () => {
    if (loading) {
      return (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      );
    }
    if (Icon) {
      return <Icon size={16} />;
    }
    return null;
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      style={buttonStyle}
    >
      {iconPosition === 'left' && renderIcon() && (
        <span className={children ? 'mr-2' : ''}>
          {renderIcon()}
        </span>
      )}
      
      {children}
      
      {iconPosition === 'right' && renderIcon() && (
        <span className={children ? 'ml-2' : ''}>
          {renderIcon()}
        </span>
      )}
    </button>
  );
};

export default AdminButton;